import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InputStyle.css";

const Input = () => {
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
  const [mode, setMode] = useState("add");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [formdata]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.example.com/get-all-data");
      setData(response.data);
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

    const endpoint = mode === "edit" ? "edit-form" : "submit-form";

    try {
      await axios.post(`https://api.example.com/${endpoint}`, formdata);
      console.log("Formulir berhasil dikirim ke backend!");
      fetchData();
      setFormData(initialFormData);
      setMode("add");
    } catch (error) {
      console.error("Gagal mengirim formulir ke backend:", error);
    }
  };

  const handleEdit = (data) => {
    setFormData(data);
    setMode("edit");
  };

  const handleDetail = (data) => {
    setFormData(data);
    setMode("detail");
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="passport_number">Passport Number</label>
          <input
            type="text"
            name="passport_number"
            id="passport_number"
            value={formdata.passport_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={formdata.full_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            type="text"
            name="date_of_birth"
            id="date_of_birth"
            value={formdata.date_of_birth}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            name="gender"
            id="gender"
            value={formdata.gender}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nationality">Nationality</label>
          <input
            type="text"
            name="nationality"
            id="nationality"
            value={formdata.nationality}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiry_date">Expiry Date</label>
          <input
            type="text"
            name="expiry_date"
            id="expiry_date"
            value={formdata.expiry_date}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="paspor_type">Paspor Type</label>
          <input
            type="text"
            name="paspor_type"
            id="paspor_type"
            value={formdata.paspor_type}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Photo</label>
          <div className="photo">
            <div className="photo-box">
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
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formdata.email}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default Input;
