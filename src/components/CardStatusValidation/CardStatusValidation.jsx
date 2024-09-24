import React, { useContext, useEffect, useState } from "react";
import "./CardStatusValidation.style.css";
const CardStatusValidation = ({
	status,
	passportImage,
}) => {
	return (
		<div className="card-status">
			<div className="card-container">
				<div className="inner-card">
					{status == 0 ?
						<div className="">
							<img src={`data:image/jpeg;base64,${passportImage}`} alt="" style={{ width: 500, height: 300 }} />
						</div>
						:
						<div className=""><h2>camera config</h2></div>
					}
				</div>
			</div>
		</div>
	);
};

export default CardStatusValidation;
