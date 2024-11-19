import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";
import NoProfile from '../../assets/images/no-profile-picture.svg'

const localDate = new Date();

// Format the date as YYYY-MM-DDt
const dateString = localDate.toISOString().split('T')[0];

// Format the time as HH:MM (local time)
const timeString = localDate.getHours().toString().padStart(2, '0') + ':' + localDate.getMinutes().toString().padStart(2, '0');

// Combine both date and time for datetime-local input
const dateTimeString = `${dateString}T${timeString}`;

const FormData = ({ sharedData, setSharedData, cardStatus, country }) => {

  const [optionNegara, setOptionNegara] = useState([]);
  const [optionGender, setOptionGender] = useState([]);
  const [rawDateInput, setRawDateInput] = useState('');
  const [rawDateTimeInput, setRawDateTimeInput] = useState('');

  const [currentDateTime, setCurrentDateTime] = useState(
    dateTimeString
  );



  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentDateTime(new Date().toLocaleString()); // Memperbarui waktu tiap detik
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const initialFormData = {
    passport_number: "",
    register_code: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    expiry_date: "",
    arrivaltime: new Date().toISOString().split('T')[0],
    destination_location: "",
    photo: "",
  };


  const [formdata, setFormData] = useState(initialFormData);

  useEffect(() => {
    const dataNationality = dataNegara.data.map((negara) => ({
      value: negara.id_negara,
      label: `${negara.id_negara} - ${negara.deskripsi_negara}`,
    }));

    setOptionNegara(dataNationality);

    const dataGender = [
      { value: "male", label: "Laki-Laki" },
      { value: "female", label: "Perempuan" },
    ];

    setOptionGender(dataGender);

    if (sharedData.passportData) {
      // const filteredNationality = dataNationality.filter(
      //   (negara) => negara.value === sharedData.passportData.nationality
      // );

      const filteredGender = dataGender.filter(
        (sex) => sex.value === sharedData.passportData.sex || ""
      );

      setFormData((prevData) => ({
        ...prevData,
        sex: filteredGender.length > 0 ? filteredGender[0] : "",
      }));


      const filteredCountry = country.filter(
        (country) => country.value === sharedData.passportData.destinationLocation
      );

      setFormData((prevData) => ({
        ...prevData,
        destination_location: filteredCountry.length > 0 ? filteredCountry[0] : "",
      }));

      setFormData((prevData) => ({
        ...prevData,
        nationality: filteredCountry.length > 0 ? filteredCountry[0] : "",
      }));




      setFormData((prevData) => ({
        ...prevData,
        passport_number: sharedData.passportData.docNumber || "",
        register_code: sharedData.passportData.noRegister || "",
        full_name: sharedData.passportData.fullName || "",
        date_of_birth: sharedData.passportData.formattedBirthDate || "",
        expiry_date: sharedData.passportData.formattedExpiryDate || "",
        arrivalTime: sharedData.passportData.arrivalTime || new Date().toISOString().split('T')[0],
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      photo: sharedData.photoFace || "",
    }));
  }, [sharedData]);


  useEffect(() => {
    console.log(sharedData, 'formdata');
  }, [sharedData]);



  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const dateTimePattern = /^\d{0,4}(-\d{0,2})?(-\d{0,2})?$/;

    if (dateTimePattern.test(value)) {
      setRawDateTimeInput(value);
      setFormData({
        ...formdata,
        [name]: value,
      });

      setSharedData((prevData) => ({
        ...prevData,
        passportData: {
          ...prevData.passportData,
          [name]: value,
        },
      }));
    }
  };


  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const datePattern = /^\d{0,4}(-\d{0,2})?(-\d{0,2})?$/;

    if (datePattern.test(value)) {
      setRawDateInput(value);
      setFormData({
        ...formdata,
        [name]: value,
      });

      setSharedData((prevData) => ({
        ...prevData,
        passportData: {
          ...prevData.passportData,
          [name]: value,
        },
      }));
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value.toUpperCase(),
    });

    setSharedData((prevData) => ({
      ...prevData,
      passportData: {
        ...prevData.passportData,
        [name]: value.toUpperCase(),
      },
    }));
  };

  const handleSelectChangeNationality = (selectedOption) => {
    console.log('test1234', selectedOption.value);
    setFormData({
      ...formdata,
      nationality: selectedOption.value,
    });

    setSharedData((prevData) => ({
      ...prevData,
      passportData: {
        ...prevData.passportData,
        nationality: selectedOption.value,
      },
    }));
  };

  const handleSelectChangeDestination = (selectedOption) => {
    setFormData({
      ...formdata,
      destination_location: selectedOption.value,
    });

    setSharedData((prevData) => ({
      ...prevData,
      passportData: {
        ...prevData.passportData,
        destination_location: selectedOption.value,
      },
    }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption,
    }));

    setSharedData((prevData) => ({
      ...prevData,
      passportData: {
        ...prevData.passportData,
        [fieldName]: selectedOption.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log('sharedData', sharedData);
  }, [sharedData]);

  console.log('formdata', formdata);

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit} className="full-width-form">
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="passport_number">Nomor PLB / BCP</label>
            </div>
            <input
              type="text"
              name="docNumber"
              id="passport_number"
              value={formdata.passport_number}
              onChange={handleInputChange}
              className="disabled-input"
              style={{ textTransform: "uppercase" }}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="full_name">Nama Lengkap</label>
            </div>
            <input
              type="text"
              name="fullName"
              id="full_name"
              value={formdata.full_name}
              onChange={handleInputChange}
              className="disabled-input"
              style={{ textTransform: "uppercase" }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="">Tanggal Lahir (DD/MM/YYYY)</label>
            </div>
            <input
              type="date"
              name="formattedBirthDate"
              id="date_of_birth"
              value={rawDateInput}
              onChange={handleDateChange}
              className="enable-input"
            />
            {/* <input
              type="date"
              name="formattedBirthDate"
              id="date_of_birth"
              value={formdata.date_of_birth}
              onChange={handleInputChange}
              className="disabled-input"
            /> */}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="gender">Jenis Kelamin</label>
            </div>
            <Select
              id="gender"
              name="sex"
              value={{
                value: formdata.sex.valueOf,
                label: formdata.sex.label,
              }}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "sex")
              }
              options={optionGender}
              className="basic-single"
              classNamePrefix="select"
              styles={{
                container: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  borderRadius: "10px",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                  fontFamily: "Roboto, Arial, sans-serif",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                }),
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="nationality">Kewarganegaraan</label>
            </div>
            <Select
              value={country.find(option => option.value === formdata.nationality)}
              onChange={handleSelectChangeNationality}
              options={
                country?.map((option) => (
                  {
                    value: option.value,
                    label: option.label
                  }
                ))
              }
              className="basic-single"
              classNamePrefix="select"
              styles={{
                container: (provided) => ({
                  ...provided,
                  position: 'relative',
                  flex: 1,
                  width: "91.7%",
                  borderRadius: "10px",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                  fontFamily: "Roboto, Arial, sans-serif",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                }),
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="expiry_date">Tanggal Kaduluarsa <span className="">(DD/MM/YYYY)</span></label>
            </div>
            <input
              type="date"
              name="formattedExpiryDate"
              id="expiry_date"
              placeholder="DD/MM/YYYY"
              value={rawDateTimeInput}
              onChange={handleDateTimeChange}
              className="enable-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="arrivalTime">Tanggal Registrasi</label>
            </div>
            <input
              type="datetime-local"
              value={currentDateTime}
              readOnly
              className="disabled-input"
            />
          </div>
        </div>
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="destination_location">Tujuan Lokasi</label>
            </div>
            <Select
              value={country.find(option => option.value === formdata.destination_location)}
              onChange={handleSelectChangeDestination}
              options={
                country?.map((option) => (
                  {
                    value: option.value,
                    label: option.label
                  }
                ))
              }
              className="basic-single"
              classNamePrefix="select"
              styles={{
                container: (provided) => ({
                  ...provided,
                  position: 'relative',
                  flex: 1,
                  width: "91.7%",
                  borderRadius: "10px",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                  fontFamily: "Roboto, Arial, sans-serif",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                }),
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="photo">Foto Wajah</label>
            </div>
            <div className="photo">
              <div className="photo-box">
                <img
                  className={formdata.photo ? "" : "no-image"}
                  src={formdata.photo || NoProfile}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


export default FormData;