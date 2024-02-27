import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";

const FormData = ({ sharedData, setSharedData, cardStatus }) => {
  // passportNumber
  const [isCheckedPassportNumber, setIsCheckedPassportNumber] = useState(false);
  // fullName
  const [isCheckedFullName, setIsCheckedFullName] = useState(false);
  // dateOfBirth
  const [isCheckedDateOfBirth, setIsCheckedDateOfBirth] = useState(false);
  // gender
  const [isCheckedGender, setIsCheckedGender] = useState(false);
  //nationality
  const [isCheckedNationality, setIsCheckedNationality] = useState(false);
  // expiryDate
  const [isCheckedExpiryDate, setIsCheckedExpiryDate] = useState(false);
  // pasporType
  const [isCheckedPasporType, setIsCheckedPasporType] = useState(false);

  const [optionNegara, setOptionNegara] = useState([]);
  const [optionGender, setOptionGender] = useState([]);

  // passportNumber
  const [isCommentDisabledPassportNumber, setIsCommentDisabledPassportNumber] =
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
  // pasporType
  const [isCommentDisabledPasporType, setIsCommentDisabledPasporType] =
    useState(true);

  const initialFormData = {
    passport_number: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    expiry_date: "",
    paspor_type: "",
    photo: "",
    email: "",
  };
  const [formdata, setFormData] = useState(initialFormData);
  
  useEffect(() => {
    // console.log("test shared data", sharedData.passportData);

    if (sharedData.passportData === null) {
      // console.log("test shared data null");
      setFormData(initialFormData);
    } else {
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
  
        // gender
        if (sharedData.passportData) {
          const filteredGender = dataGender.filter(
            (sex) => sex.value === sharedData.passportData.sex
          );
  
          setFormData((prevData) => ({
            ...prevData,
            sex: filteredGender.length > 0 ? filteredGender[0] : "",
          }));
        }
  
        setFormData((prevData) => ({
          ...prevData,
          passport_number: sharedData.passportData.documentNumber || "",
          full_name: sharedData.passportData.firstName + " " + sharedData.passportData.lastName || "",
          date_of_birth: convertBirthDate(sharedData.passportData.birthDate) || "",
          nationality: filteredNationality.length > 0 ? filteredNationality[0] : "",
          expiry_date: convertExpiryDate(sharedData.passportData.expirationDate) || "",
          passport_type: (sharedData.passportData.documentCode === "PM" ? "Passport" : sharedData.passportData.documentCode) || "",
        }));
        
        function convertExpiryDate(expirationDate) {
          if (!expirationDate) return "";
          
          const day = parseInt(expirationDate.substring(0, 2));
          const month = parseInt(expirationDate.substring(2, 4)) - 1; // Kurangi 1 karena bulan dimulai dari 0
          const year = 2000 + parseInt(expirationDate.substring(4, 6));
          
          const expiryDate = new Date(year, month, day).toISOString().split("T")[0];
          return expiryDate;
        }
        
        function convertBirthDate(birthDate) {
          if (!birthDate) return "";
          
          const day = parseInt(birthDate.substring(0, 2));
          const month = parseInt(birthDate.substring(2, 4)) - 1; // Kurangi 1 karena bulan dimulai dari 0
          const year = 2000 + parseInt(birthDate.substring(4, 6));
          
          const formattedBirthDate = new Date(year, month, day).toISOString().split("T")[0];
          return formattedBirthDate;
        }
      }


  
      setFormData((prevData) => ({
        ...prevData,
        photo: sharedData.photoFace || "",
      }));
  
      setFormData((prevData) => ({
        ...prevData,
        email: sharedData.email || "",
      }));
    }


  }, [sharedData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
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
    // console.log(sharedData);
    // console.log(formdata);
  };

  const handleImageClick = (type) => {
    if (type === "expiry_date") {
      setIsCheckedExpiryDate(!isCheckedExpiryDate);
      setIsCommentDisabledExpiryDate(!isCommentDisabledExpiryDate);
    } else if (type === "paspor_type") {
      setIsCheckedPasporType(!isCheckedPasporType);
      setIsCommentDisabledPasporType(!isCommentDisabledPasporType);
    } else if (type === "nationality") {
      setIsCheckedNationality(!isCheckedNationality);
      setIsCommentDisabledNationality(!isCommentDisabledNationality);
    } else if (type === "passport_number") {
      setIsCheckedPassportNumber(!isCheckedPassportNumber);
      setIsCommentDisabledPassportNumber(!isCommentDisabledPassportNumber);
    } else if (type === "full_name") {
      setIsCheckedFullName(!isCheckedFullName);
      setIsCommentDisabledFullName(!isCommentDisabledFullName);
    } else if (type === "date_of_birth") {
      setIsCheckedDateOfBirth(!isCheckedDateOfBirth);
      setIsCommentDisabledDateOfBirth(!isCommentDisabledDateOfBirth);
    } else if (type === "gender") {
      setIsCheckedGender(!isCheckedGender);
      setIsCommentDisabledGender(!isCommentDisabledGender);
    }
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    // console.log(selectedOption);
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

    // console.log(formdata);
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
              <label htmlFor="passport_number">Passport Number</label>
            </div>
            <input
              type="text"
              name="docNumber"
              id="passport_number"
              value={formdata.passport_number}
              onChange={handleInputChange}
              disabled={
                cardStatus === "checkData" ? !isCheckedPassportNumber : true
              }
              className="disabled-input"
            />

            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledPassportNumber && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedPassportNumber ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("passport_number")}
                />
              </>
            ) : null}
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
              disabled={cardStatus === "checkData" ? !isCheckedFullName : true}
              className="disabled-input"
            />

            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledFullName && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedFullName ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("full_name")}
                />
              </>
            ) : null}
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
              disabled={
                cardStatus === "checkData" ? !isCheckedDateOfBirth : true
              }
              className="disabled-input"
            />
            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledDateOfBirth && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedDateOfBirth ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("date_of_birth")}
                />
              </>
            ) : null}
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
              isDisabled={cardStatus === "checkData" ? !isCheckedGender : true}
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
            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledGender && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedGender ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("gender")}
                />
              </>
            ) : null}
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
              isDisabled={
                cardStatus === "checkData" ? !isCheckedNationality : true
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
            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledNationality && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedNationality ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("nationality")}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="expiry_date">Expiry Date</label>
            </div>
            <input
              type="date"
              name="formattedExpiryDate"
              id="expiry_date"
              value={formdata.expiry_date}
              onChange={handleInputChange}
              disabled={
                cardStatus === "checkData" ? !isCheckedExpiryDate : true
              }
              className="disabled-input"
            />
            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledExpiryDate && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  style={{
                    cursor: "pointer",
                    opacity: !isCheckedExpiryDate ? 0.5 : 1,
                  }}
                  onClick={() => handleImageClick("expiry_date")}
                  alt="Checklist Icon"
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="paspor_type">Passport Type</label>
            </div>
            <input
              type="text"
              name="passport_type"
              id="paspor_type"
              value={formdata.passport_type}
              onChange={handleInputChange}
              disabled={
                cardStatus === "checkData" ? !isCheckedPasporType : true
              }
              className="disabled-input"
            />

            {cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledPasporType && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${
                    !isCheckedPasporType ? "dimmed" : ""
                  }`}
                  onClick={() => handleImageClick("paspor_type")}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="photo">Photo</label>
            </div>
            <div className="photo">
              <div className="photo-box">
                {formdata.photo !== null && formdata.photo !== "" ? (
                  <img src={formdata.photo} alt="" />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="email">Email</label>
            </div>
            <input
              type="text"
              name="email"
              id="email"
              value={formdata.email}
              disabled
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormData;
