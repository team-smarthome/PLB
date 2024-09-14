import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataValidation.style.css";
import dataNegara from "../../utils/dataNegara";
import NoProfile from '../../assets/images/no-profile-picture.svg'

const FormDataValidation = ({ setSharedData, dataLogs }) => {
  const [optionNegara, setOptionNegara] = useState(dataNegara.data.map((negara) => ({
    value: negara?.id_negara,
    label: `${negara?.id_negara} - ${negara?.deskripsi_negara}`,
  })));
  const [optionGender, setOptionGender] = useState([
    { value: "male", label: "MALE" },
    { value: "female", label: "FEMALE" },
  ]);

  // passportNumber
  const [isCommentDisabledPassportNumber, setIsCommentDisabledPassportNumber] =
    useState(true);
  //Registrasion Number
  const [isCommentDisabledRegisterCode, setIsCommentDisabledRegisterCode] =
    useState(true);
  // fullName
  const [isCommentDisabledFullName, setIsCommentDisabledFullName] =
    useState(true);
  // dateOfBirth
  const [isCommentDisabledDateOfBirth, setIsCommentDisabledDateOfBirth] =
    useState(true);
  // gender
  const [isCommentDisabledGender, setIsCommentDisabledGender] = useState(true);
  // nationality
  const [isCommentDisabledNationality, setIsCommentDisabledNationality] =
    useState(true);
  // expiryDate
  const [isCommentDisabledExpiryDate, setIsCommentDisabledExpiryDate] =
    useState(true);
  // arrivalTime
  const [isCommentDisabledArrivalTime, setIsCommentDisabledArrivalTime] =
    useState(true);
  // destinationLocation
  const [isCommentDisabledDestinationLocation, setIsCommentDisabledDestinationLocation] =
    useState(true);
  console.log(dataLogs, "datalog from form")
  // const initialFormData = 

  const [formdata, setFormData] = useState({
    passport_number: "",
    register_code: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    expiry_date: "",
    arrivaltime: new Date().toISOString().split('T')[0], // Default to today if no dataLogs
    destination_location: "",
    photo: "",
  });

  useEffect(() => {
    const findNationality = dataNegara.data.find((data) => data?.id_negara === dataLogs?.nationality)
    setFormData({
      passport_number: dataLogs?.no_passport || "",
      register_code: dataLogs?.no_register || "",
      full_name: dataLogs?.name || "",
      date_of_birth: dataLogs?.date_of_birth || "",
      sex: dataLogs?.gender === "M"
        ? { value: "male", label: "MALE" }
        : dataLogs?.gender === "F"
          ? { value: "female", label: "FEMALE" }
          : "",
      nationality: dataLogs?.nationality
        ? { valueOf: findNationality?.id_negara, label: findNationality?.deskripsi_negara }
        : "",
      expiry_date: dataLogs?.expired_date || "",
      arrivaltime: dataLogs?.arrival_time || new Date().toISOString().split('T')[0],
      destination_location: dataLogs?.destination_location || "",
      photo: dataLogs?.profile_image || "",
    });
  }, [dataLogs]);


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
              // onChange={handleInputChange}
              className="disabled-input"
            />
          </div>
        </div>

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
        </div>

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
              type="datetime"
              name="arrivalTime"
              id="arrivalTime"
              value={formdata.arrivaltime}
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
            <input
              type="text"
              name="destinationLocation"
              id="destination_location"
              value={formdata.destination_location}
              onChange={handleInputChange}
              className="disabled-input"
            />
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
                  src={formdata.photo ? `data:image/jpeg;base64,${formdata.photo}` : NoProfile}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


export default FormDataValidation;
