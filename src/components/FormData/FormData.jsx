import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";
import NoProfile from '../../assets/images/no-profile-picture.svg'
import moment from 'moment';

const localDate = new Date();

// Format the date as YYYY-MM-DD
const dateString = localDate.toISOString().split('T')[0];

// Format the time as HH:MM (local time)
const timeString = localDate.getHours().toString().padStart(2, '0') + ':' + localDate.getMinutes().toString().padStart(2, '0');

// Combine both date and time for datetime-local input
const dateTimeString = `${dateString}T${timeString}`;

const FormData = ({ sharedData, setSharedData, cardStatus, country }) => {

  const [optionNegara, setOptionNegara] = useState([]);
  const [optionGender, setOptionGender] = useState([]);

  const initialFormData = {
    passport_number: "",
    register_code: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    expiry_date: "",
    arrivalTime: dateTimeString,
    destination_location: "",
    photo: "",
  };
 

  const [formdata, setFormData] = useState(initialFormData);

  const [rawDateInput, setRawDateInput] = useState(''); 
  const [rawDateTimeInput, setRawDateTimeInput] = useState(''); // Separate state to hold raw input

  const handleDateChange = (e) => {
    const value = e.target.value;

    // Regex to match partial or complete date in format YYYY-MM-DD
    const datePattern = /^\d{0,4}(-\d{0,2})?(-\d{0,2})?$/;

    // Update raw input for partial typing and restrict to pattern
    if (datePattern.test(value)) {
      setRawDateInput(value);

      // Only update formdata when the input is a complete and valid date
      // if (moment(value, "YYYY-MM-DD", true).isValid()) {
        // console.log(value)
        setFormData({
          ...formdata,
          date_of_birth: value,
        });
      // }
    }
  };
  
  const handleDateTimeChange = (e) => {
    const value = e.target.value;

    // Regex for validating the format: DD/MM/YYYY HH:MM, with a 4-digit year
    const dateTimePattern = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;

    // Allow partial input and make sure we don't lose data
    if (dateTimePattern.test(value) || value === '' || value.length <= 16) {
      setRawDateTimeInput(value);

      // Only update formdata when the input is a complete and valid datetime
      // if (moment(value, "DD/MM/YYYY HH:mm", true).isValid()) {
      
        setFormData({
          ...formdata,
          expiry_date: value,
        });
      }
    // } else if (value.length <= 16) {
      
      // Allow up to 16 characters (for DD/MM/YYYY HH:MM format)
      setRawDateTimeInput(value);
    // }
  };
  
  // useEffect(() => {
  //   console.log(formdata, "formData")  
  // }, [])
  

  useEffect(() => {
    const dataNationality = dataNegara.data.map((negara) => ({
      value: negara.id_negara,
      label: `${negara.id_negara} - ${negara.deskripsi_negara}`,
    }));

    setOptionNegara(dataNationality);

    const dataGender = [
      { value: "male", label: "MALE" },
      { value: "female", label: "FEMALE" },
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
        // nationality:
        //   filteredNationality.length > 0 ? filteredNationality[0] : "",
        expiry_date: sharedData.passportData.formattedExpiryDate || "",
        arrivalTime: sharedData.passportData.arrivalTime || new Date().toISOString().split('T')[0],
      }));
    }
    console.log("sharedDataFormData", sharedData);
    setFormData((prevData) => ({
      ...prevData,
      photo: sharedData.photoFace || "",
    }));
    // }
  }, [sharedData]);

  console.log("formdaFormData", formdata);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
  };

  const handleSelectChangeNationality = (selectedOption) => {
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
            />
          </div>
        </div>
        {/* 
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="register_code">Registrasion Number</label>
            </div>
            <input
              type="text"
              name="noRegister"
              id="register_code"
              value={formdata.register_code}
              onChange={handleInputChange}
              className="disabled-input"
            />
          </div>
        </div> */}

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
              value={rawDateInput} // Bind raw input value
              onChange={handleDateChange}
              className="enable-input"
            />
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
              <label htmlFor="expiry_date">Tanggal Expired <span className="">(DD/MM/YYYY HH:MM)</span></label>
            </div>
            <input
              type="datetime-local"
              name="formattedExpiryDate"
              id="expiry_date"
              placeholder="DD/MM/YYYY HH:MM"
              value={rawDateTimeInput} // Bind raw input value
              onChange={handleDateTimeChange}
              className="disabled-input"
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
              name="arrivalTime"
              id="arrivalTime"
              readOnly
              defaultValue={formdata.arrivalTime}
              // value={formdata.arrivalTime}
              onChange={handleInputChange}
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
