import React, { useEffect, useState } from "react";
import Select from "react-select";
import Checklist from "../../assets/images/group.svg";
import "./FormDataStyle.css";
import dataNegara from "../../utils/dataNegara";

const FormData = ({ sharedData, setSharedData, cardStatus }) => {
  // PLB / BCP Number
  const [isCheckedPassportNumber, setIsCheckedPassportNumber] = useState(false);
  //Registrasion Number
  const [isCheckedRegisterCode, setIsCheckedRegisterCode] = useState(false);
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
  // arrivalTime
  const [isCheckedArrivalTime, setIsCheckedArrivalTime] = useState(false);
  // destinationLocation
  const [isCheckedDestinationLocation, setIsCheckedDestinationLocation] = useState(false);

  const [optionNegara, setOptionNegara] = useState([]);
  const [optionGender, setOptionGender] = useState([]);

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

  const initialFormData = {
    passport_number: "",
    register_code: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    expiry_date: "",
    arrival_time: "",
    destination_location: "",
    photo: "",
  };

  const [formdata, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (sharedData.passportData === null) {
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
            (sex) => sex.value === sharedData.passportData.sex || ""
          );

          setFormData((prevData) => ({
            ...prevData,
            sex: filteredGender.length > 0 ? filteredGender[0] : "",
          }));
        }

        setFormData((prevData) => ({
          ...prevData,
          passport_number: sharedData.passportData.docNumber || "",
          register_code: sharedData.passportData.noRegister || "",
          full_name: sharedData.passportData.fullName || "",
          date_of_birth: sharedData.passportData.formattedBirthDate || "",
          nationality:
            filteredNationality.length > 0 ? filteredNationality[0] : "",
          expiry_date: sharedData.passportData.formattedExpiryDate || "",
          arrival_time: sharedData.passportData.arrivalTime || "",
          destination_location: sharedData.passportData.destinationLocation || "",
        }));
      }

      setFormData((prevData) => ({
        ...prevData,
        photo: sharedData.photoFace || "",
      }));
    }
  }, [sharedData]);


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

  const handleImageClick = (type) => {
    switch (type) {
      case "passport_number":
        setIsCheckedPassportNumber(!isCheckedPassportNumber);
        setIsCommentDisabledPassportNumber(!isCommentDisabledPassportNumber);
        break;
      case "register_code":
        setIsCheckedRegisterCode(!isCheckedRegisterCode);
        setIsCommentDisabledRegisterCode(!isCommentDisabledRegisterCode);
        break;
      case "full_name":
        setIsCheckedFullName(!isCheckedFullName);
        setIsCommentDisabledFullName(!isCommentDisabledFullName);
        break;
      case "date_of_birth":
        setIsCheckedDateOfBirth(!isCheckedDateOfBirth);
        setIsCommentDisabledDateOfBirth(!isCommentDisabledDateOfBirth);
        break;
      case "gender":
        setIsCheckedGender(!isCheckedGender);
        setIsCommentDisabledGender(!isCommentDisabledGender);
        break;
      case "nationality":
        setIsCheckedNationality(!isCheckedNationality);
        setIsCommentDisabledNationality(!isCommentDisabledNationality);
        break;
      case "expiry_date":
        setIsCheckedExpiryDate(!isCheckedExpiryDate);
        setIsCommentDisabledExpiryDate(!isCommentDisabledExpiryDate);
        break;
      case "arrival_time":
        setIsCheckedArrivalTime(!isCheckedArrivalTime);
        setIsCommentDisabledArrivalTime(!isCommentDisabledArrivalTime);
        break;
      case "destination_location":
        setIsCheckedDestinationLocation(!isCheckedDestinationLocation);
        setIsCommentDisabledDestinationLocation(!isCommentDisabledDestinationLocation);
        break;
      default:
        break;
    }
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
              disabled={
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedPassportNumber : true
              }
              className="disabled-input"
            />

            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledPassportNumber && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedPassportNumber ? "dimmed" : ""
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
              <label htmlFor="register_code">Registrasion Number</label>
            </div>
            <input
              type="text"
              name="noRegister"
              id="register_code"
              value={formdata.register_code}
              onChange={handleInputChange}
              disabled={
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedRegisterCode : true
              }
              className="disabled-input"
            />

            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledRegisterCode && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedRegisterCode ? "dimmed" : ""
                    }`}
                  onClick={() => handleImageClick("register_code")}
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
              disabled={cardStatus === "iddle" ? !isCheckedFullName : true}
              className="disabled-input"
            />

            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledFullName && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedFullName ? "dimmed" : ""
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
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedDateOfBirth : true
              }
              className="disabled-input"
            />
            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledDateOfBirth && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedDateOfBirth ? "dimmed" : ""
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
              isDisabled={cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedGender : true}
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
            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledGender && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedGender ? "dimmed" : ""
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
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedNationality : true
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
            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledNationality && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedNationality ? "dimmed" : ""
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
              <label htmlFor="expiry_date">Expired Date</label>
            </div>
            <input
              type="date"
              name="formattedExpiryDate"
              id="expiry_date"
              value={formdata.expiry_date}
              onChange={handleInputChange}
              disabled={
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedExpiryDate : true
              }
              className="disabled-input"
            />
            {cardStatus === "iddle" || cardStatus === "checkData" ? (
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
              <label htmlFor="arrival_time">Arrival Time</label>
            </div>
            <input
              type="date"
              name="arrivalTime"
              id="arrival_time"
              value={formdata.arrival_time}
              onChange={handleInputChange}
              disabled={
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedArrivalTime : true
              }
              className="disabled-input"
            />
            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledArrivalTime && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  style={{
                    cursor: "pointer",
                    opacity: !isCheckedExpiryDate ? 0.5 : 1,
                  }}
                  onClick={() => handleImageClick("arrival_time")}
                  alt="Checklist Icon"
                />
              </>
            ) : null}
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
              disabled={
                cardStatus === "iddle" || cardStatus === "checkData" ? !isCheckedDestinationLocation : true
              }
              className="disabled-input"
            />

            {cardStatus === "iddle" || cardStatus === "checkData" ? (
              <>
                <div className="checkbox-container">
                  {isCommentDisabledDestinationLocation && (
                    <div className="checkbox-value"></div>
                  )}
                </div>
                <img
                  src={Checklist}
                  alt="Checklist Icon"
                  className={`checklist-img ${!isCheckedDestinationLocation ? "dimmed" : ""
                    }`}
                  onClick={() => handleImageClick("destination_location")}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="photo">Pas Foto</label>
            </div>
            <div className="photo">
              <div className="photo-box">
                <img
                  src={formdata.photo || ""}
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
