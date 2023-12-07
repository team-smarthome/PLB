import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";

const FormData = ({ sharedData, setSharedData }) => {
  const [isCheckedExpiryDate, setIsCheckedExpiryDate] = useState(false);
  const [isCheckedPasporType, setIsCheckedPasporType] = useState(false);
  const [optionNegara, setOptionNegara] = useState([]);
  // const [isCommentDisabledExpiryDate, setIsCommentDisabledExpiryDate] =
  //   useState(true);
  // const [isCommentDisabledPasporType, setIsCommentDisabledPasporType] =
  //   useState(true);

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

  // const handleImageClick = (type) => {
  //   if (type === "expiry_date") {
  //     setIsCheckedExpiryDate(!isCheckedExpiryDate);
  //     setIsCommentDisabledExpiryDate(!isCommentDisabledExpiryDate);
  //   } else if (type === "paspor_type") {
  //     setIsCheckedPasporType(!isCheckedPasporType);
  //     setIsCommentDisabledPasporType(!isCommentDisabledPasporType);
  //   }
  // };

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
              disabled
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
              <div className="checkbox-value"></div>
            </div>
            <img
              src={Checklist}
              alt="Checklist Icon"
              className={`checklist-img ${isCheckedPasporType ? "dimmed" : ""}`}
              onClick={() => handleImageClick("paspor_type")}
            /> */}
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
              disabled
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
              <div className="checkbox-value"></div>
            </div>
            <img
              src={Checklist}
              alt="Checklist Icon"
              className={`checklist-img ${isCheckedPasporType ? "dimmed" : ""}`}
              onClick={() => handleImageClick("paspor_type")}
            /> */}
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
              disabled
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
              <div className="checkbox-value"></div>
            </div>
            <img
              src={Checklist}
              alt="Checklist Icon"
              className={`checklist-img ${isCheckedPasporType ? "dimmed" : ""}`}
              onClick={() => handleImageClick("paspor_type")}
            /> */}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="gender">Gender</label>
            </div>
            <input
              type="text"
              name="gender"
              id="gender"
              value={formdata.gender}
              onChange={handleInputChange}
              disabled
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
              <div className="checkbox-value"></div>
            </div>
            <img
              src={Checklist}
              alt="Checklist Icon"
              className={`checklist-img ${isCheckedPasporType ? "dimmed" : ""}`}
              onClick={() => handleImageClick("paspor_type")}
            /> */}
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
              isDisabled
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

            {/* <div className="checkbox-container">
              <div className="checkbox-value"></div>
            </div>
            <img
              src={Checklist}
              alt="Checklist Icon"
              className={`checklist-img ${isCheckedPasporType ? "dimmed" : ""}`}
              onClick={() => handleImageClick("paspor_type")}
            /> */}
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
              disabled={isCheckedExpiryDate}
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
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
            /> */}
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
              disabled={isCheckedPasporType}
              className="disabled-input"
            />

            {/* <div className="checkbox-container">
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
            /> */}
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

            {/* <div className="checkbox-container">
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
            /> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormData;
