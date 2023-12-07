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
    gender: "",
    nationality: "",
    expiry_date: "",
    paspor_type: "",
    photo: "",
    email: "",
  };
  const [formdata, setFormData] = useState(initialFormData);

  useEffect(() => {
    const dataNationality = dataNegara.data.map((negara) => ({
      value: negara.id_negara,
      label: `${negara.id_negara} - ${negara.deskripsi_negara}`,
    }));

    setOptionNegara(dataNationality);

    if (sharedData.passportData) {
      const filteredNationality = dataNationality.filter(
        (negara) => negara.value === sharedData.passportData.nationality
      );

      console.log(filteredNationality[0]);

      setFormData((prevData) => ({
        ...prevData,
        passport_number: sharedData.passportData.docNumber || "",
        full_name: sharedData.passportData.fullName || "",
        date_of_birth: sharedData.passportData.formattedBirthDate || "",
        gender: sharedData.passportData.sex || "",
        nationality:
          filteredNationality.length > 0 ? filteredNationality[0] : "",
        expiry_date: sharedData.passportData.formattedExpiryDate || "",
        paspor_type: sharedData.passportData.docType || "",
      }));
      setIsCheckedExpiryDate(!!sharedData.passportData.formattedExpiryDate);
      setIsCheckedPasporType(!!sharedData.passportData.docType);
    }

    setFormData((prevData) => ({
      ...prevData,
      photo: sharedData.photoFace || "",
    }));

    setFormData((prevData) => ({
      ...prevData,
      email: sharedData.email || "",
    }));
  }, [sharedData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
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
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption,
    }));

    console.log(formdata);
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
              name="passport_number"
              id="passport_number"
              value={formdata.passport_number}
              onChange={handleInputChange}
              disabled={cardStatus === "checkData" ? !isCheckedPassportNumber : true}
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
              name="full_name"
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
              name="date_of_birth"
              id="date_of_birth"
              value={formdata.date_of_birth}
              onChange={handleInputChange}
              disabled={cardStatus === "checkData" ? !isCheckedDateOfBirth : true}
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
              name="gender"
              value={formdata.gender}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "gender")
              }
              disabled={cardStatus === "checkData" ? !isCheckedGender : true}
              options={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
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
            {/* <Select
              id="gender"
              name="gender"
              value={{
                value: formdata.gender.value,
                label: formdata.gender.label,
              }}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "gender")
              }
              isDisabled={!isCheckedGender}
              options={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
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
            /> */}
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
                value: formdata.nationality.value,
                label: formdata.nationality.label,
              }}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "nationality")
              }
              disabled={cardStatus === "checkData" ? !isCheckedNationality : true}
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
              name="expiry_date"
              id="expiry_date"
              value={formdata.expiry_date}
              onChange={handleInputChange}
              disabled={cardStatus === "checkData" ? !isCheckedExpiryDate : true}
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
                    opacity: isCheckedExpiryDate ? 0.5 : 1,
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
              <label htmlFor="paspor_type">Paspor Type</label>
            </div>
            <input
              type="text"
              name="paspor_type"
              id="paspor_type"
              value={formdata.paspor_type}
              onChange={handleInputChange}
              disabled={cardStatus === "checkData" ? !isCheckedPasporType : true}
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
                  style={{
                    cursor: "pointer",
                    opacity: isCheckedPasporType ? 0.5 : 1,
                  }}
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
                {formdata.photo !== null || formdata.photo !== "" ? (
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
                  style={{
                    cursor: "pointer",
                    opacity: isCheckedPasporType ? 0.5 : 1,
                  }}
                  onClick={() => handleImageClick("paspor_type")}
                />
              </>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormData;
