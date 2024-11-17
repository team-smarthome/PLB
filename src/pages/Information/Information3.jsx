import React from 'react'
import "./InformationStyle3.css"

const Information3 = () => {
    return (
        <div class="main_box">
            <input type="checkbox" id="check" />
            <div class="btn_one">
                <label for="check">
                    <i class="fas fa-bars"></i>
                </label>
            </div>
            <div class="sidebar_menu">
                <div class="logo">
                    <a href="#">PLB</a>
                </div>
                <div class="btn_two">
                    <label for="check">
                        <i class="fas fa-times"></i>
                    </label>
                </div>
                <div class="menu">
                    <ul>
                        <li>
                            <i class="fas fa-qrcode"></i>
                            <a href="#">Dashboard</a>
                        </li>
                        <li>
                            <i class="fas fa-link"></i>
                            <a href="#">Shortcuts</a>
                        </li>
                        <li>
                            <i class="fas fa-stream"></i>
                            <a href="#">Overview</a>
                        </li>
                        <li>
                            <i class="fas fa-calendar-week"></i>
                            <a href="#">Events</a>
                        </li>
                        <li>
                            <i class="fas fa-question-circle"></i>
                            <a href="#">About</a>
                        </li>
                        <li>
                            <i class="fas fa-sliders-h"></i>
                            <a href="#">Services</a>
                        </li>
                        <li>
                            <i class="fas fa-phone-volume"></i>
                            <a href="#">Contact</a>
                        </li>
                        <li>
                            <i class="far fa-comments"></i>
                            <a href="#">Feedback</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Information3