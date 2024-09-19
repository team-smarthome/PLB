import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";
import NoProfile from '../../assets/images/no-profile-picture.svg'

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
      { value: "male", label: "MALE" },
      { value: "female", label: "FEMALE" },
    ];

    setOptionGender(dataGender);

    if (sharedData.passportData) {
      const filteredNationality = dataNationality.filter(
        (negara) => negara.value === sharedData.passportData.nationality
      );

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
        passport_number: sharedData.passportData.docNumber || "",
        register_code: sharedData.passportData.noRegister || "",
        full_name: sharedData.passportData.fullName || "",
        date_of_birth: sharedData.passportData.formattedBirthDate || "",
        nationality:
          filteredNationality.length > 0 ? filteredNationality[0] : "",
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
              <label htmlFor="passport_number">PLB / BCP Number</label>
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
              <label htmlFor="full_name">Full Name</label>
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
              <label htmlFor="date_of_birth">Date of Birth</label>
            </div>
            <input
              type="date"
              name="formattedBirthDate"
              id="date_of_birth"
              value={formdata.date_of_birth}
              onChange={handleInputChange}
              className="disabled-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="gender">Gender</label>
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
              <label htmlFor="nationality">Nationality</label>
            </div>
            <Select
              id="nationality"
              name="nationality"
              value={{
                value: formdata.nationality.valueOf,
                label: formdata.nationality.label,
              }}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "nationality")
              }
              options={optionNegara}
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
              <label htmlFor="expiry_date">Expired Date</label>
            </div>
            <input
              type="date"
              name="formattedExpiryDate"
              id="expiry_date"
              value={formdata.expiry_date}
              onChange={handleInputChange}
              className="disabled-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="arrivalTime">Arrival Time</label>
            </div>
            <input
              type="date"
              name="arrivalTime"
              id="arrivalTime"
              value={formdata.arrivalTime}
              onChange={handleInputChange}
              className="disabled-input"
            />
          </div>
        </div>
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="destination_location">Destination Location</label>
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
            {/* <input
              type="text"
              name="destinationLocation"
              id="destination_location"
              value={formdata.destination_location}
              onChange={handleInputChange}
              className="disabled-input"
            /> */}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="photo">Face</label>
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
