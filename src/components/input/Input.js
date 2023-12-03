import React, { useEffect, useState } from "react";
import "./InputStyle.css";
import Checklist from "../../assets/images/group.svg";
import axios from "axios";

const Input = () => {
  const [isCheckedExpiryDate, setIsCheckedExpiryDate] = useState(false);
  const [isCheckedPasporType, setIsCheckedPasporType] = useState(false);
  const [isCommentDisabledExpiryDate, setIsCommentDisabledExpiryDate] =
    useState(true);
  const [isCommentDisabledPasporType, setIsCommentDisabledPasporType] =
    useState(true);
  const [status, setStatus] = useState("iddle");

  const initialFormData = {
    passport_number: "X123J123",
    full_name: "JOHN ANTHONY GINTING ",
    date_of_birth: "1990-09-09",
    gender: "MALE",
    nationality: "USA -UNITED STATES OF AMERICA",
    expiry_date: "2030-09-09",
    paspor_type: "P- ORDINARY PASPORT",
    photo: "",
    email: "",
  };
  const [formdata, setFormData] = useState(initialFormData);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/data?passport_number=${formdata.passport_number}`
      );
      const data = response.data;

      setFormData((prevData) => ({
        ...prevData,
        expiry_date: data.expiry_date || "",
        paspor_type: data.paspor_type || "",
      }));

      setIsCheckedExpiryDate(!!data.expiry_date);
      setIsCheckedPasporType(!!data.paspor_type);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [formdata]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/data", formdata);
      fetchData();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Gagal mengirim formulir ke backend:", error);
    }
  };

  return (
    <>
      {status === "checkData" ? (
        <div className="container-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="wrapper-form">
                <label htmlFor="passport_number">Passport Number</label>
                <input
                  type="text"
                  name="passport_number"
                  id="passport_number"
                  value={formdata.passport_number}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="checkbox-container">
                <div className="checkbox-value"></div>
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
              </div>
              <div className="checkbox-container">
                <div className="checkbox-value"></div>
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
              </div>
              <div className="checkbox-container">
                <div className="checkbox-value"></div>
              </div>
              {/* <img 
            src={Checklist}
          /> */}
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
              </div>
              <div className="checkbox-container">
                <div className="checkbox-value"></div>
              </div>
              {/* <img 
            src={Checklist}
          /> */}
            </div>

            <div className="form-group">
              <div className="wrapper-form">
                <div className="wrapper-input">
                  <label htmlFor="nationality">Nationality</label>
                </div>
                <input
                  type="text"
                  name="nationality"
                  id="nationality"
                  value={formdata.nationality}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="checkbox-container">
                <div className="checkbox-value"></div>
              </div>
              {/* <img 
            src={Checklist}
          /> */}
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
                  disabled={!isCheckedExpiryDate}
                  className="disabled-input"
                />
              </div>
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
                //kalau mau dibikin buram
                //kalau mau dihilangin
                // style={{
                //   cursor: 'pointer',
                //   opacity: isChecked ? 0.5 : 1,
                //   display: isChecked ? 'none' : 'block',
                // }}
              />
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
                  disabled={!isCheckedPasporType}
                  className="disabled-input"
                />
              </div>
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
            </div>

            <div className="form-group">
              <div className="wrapper-form">
                <div className="wrapper-input">
                  <label htmlFor="photo">Photo</label>
                </div>
              </div>
              <div className="photo">
                <div className="photo-box">
                  <img
                    src={formdata.photo}
                    alt={formdata.full_name || "Applicant"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="wrapper-form">
                <div className="wrapper-input">
                  <label htmlFor="email">Email</label>
                </div>
                <input
                  // style={{marginLeft: "52px", marginRight: "4px"}}
                  type="text"
                  name="email"
                  id="email"
                  value={formdata.email}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="checkbox-container"> */}
              {/* <div className="checkbox-value">
          </div> */}
              {/* </div> */}
              {/* <img 
            src={Checklist}
          /> */}
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="container-form1">
            <form onSubmit={handleSubmit}>
              <div className="form-group1">
                <label htmlFor="passport_number">Passport Number</label>
                <input
                  type="text"
                  name="passport_number"
                  id="passport_number"
                  value={formdata.passport_number}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formdata.full_name}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group1">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="text"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formdata.date_of_birth}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group1">
                <label htmlFor="gender">Gender</label>
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  value={formdata.gender}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group1">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  id="nationality"
                  value={formdata.nationality}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="expiry_date">Expiry Date</label>
                <input
                  type="text"
                  name="expiry_date"
                  id="expiry_date"
                  value={formdata.expiry_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group1">
                <label htmlFor="paspor_type">Paspor Type</label>
                <input
                  type="text"
                  name="paspor_type"
                  id="paspor_type"
                  value={formdata.paspor_type}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="photo">Photo</label>
                <div className="photo1">
                  <div className="photo-box1">
                    {/* <input
                type="text"
                name="photo"
                id="photo"
                value={formdata.photo}
                onChange={handleInputChange}
              /> */}
                  </div>
                </div>
              </div>
              <div className="form-group1">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formdata.email}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Input;
