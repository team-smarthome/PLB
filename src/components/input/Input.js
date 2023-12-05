import React, { useEffect, useState } from "react";
import "./InputStyle.css";
import Checklist from "../../assets/images/group.svg";

const Input = () => {
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

  useEffect(() => {
    fetchData();
  }, [formdata]);

  const fetchData = async () => {
    try {
      // const response = await axios.get("https://api.example.com/get-all-data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // await axios.post(`https://api.example.com/${endpoint}`, formdata);
      console.log("Formulir berhasil dikirim ke backend!");
      fetchData();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Gagal mengirim formulir ke backend:", error);
    }
  };

  return (
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
              // style={{marginLeft: "52px", marginRight: "4px"}}
              type="text"
              name="gender"
              id="gender"
              value={formdata.gender}
              onChange={handleInputChange}
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
            />
          </div>
          <div className="checkbox-container">
            {/* <div className="checkbox-value">

          </div> */}
          </div>
          <img src={Checklist} alt="check" />
        </div>

        <div className="form-group">
          <div className="wrapper-form">
            <div className="wrapper-input">
              <label htmlFor="paspor_type">Paspor Type</label>
            </div>
            <input
              // style={{marginLeft: "52px", marginRight: "4px"}}
              type="text"
              name="paspor_type"
              id="paspor_type"
              value={formdata.paspor_type}
              onChange={handleInputChange}
            />
          </div>
          <div className="checkbox-container">
            {/* <div className="checkbox-value">
          </div> */}
          </div>
          <img src={Checklist} alt="check" />
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
  );
};

export default Input;
