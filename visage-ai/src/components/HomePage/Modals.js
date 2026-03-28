import React from "react";
import "./Modals.css";
import prathmeshImg from "../../assets/2.jpg";
import sanikaImg from "../../assets/1.jpg";

const Modals = () => {
  return (
    <>
      <Modal
        id="sanikaModal"
        name="Sanika Nayakal"
        img={sanikaImg}
        description="I am Sanika Nayakal, an Electronics and Telecommunication engineer passionate about technology and innovation. I enjoy working with AI, deep learning, and web development to build smart solutions."
        goals="To use my skills in Electronics, Telecommunication, AI, and web development to create innovative and useful solutions. I aim to keep learning new technologies, solve real-world problems."
        email="nayakalsanika137@gmail.com"
        instagram="https://www.instagram.com/sa.nika6542/"
        linkedin="https://www.linkedin.com/in/sanika-nayakal-1ab79a322/"
        phone="7387366302"
      />

      <Modal
        id="prathmeshModal"
        name="Prathamesh Pabe"
        img={prathmeshImg}
        description="I am Prathamesh Pabe, a Computer Science Engineering student specializing in AIML, passionate about real-time AI and innovation."
        goals="To become an AI innovator and contribute impactful technologies globally."
        email="prathameshpabe@gmail.com"
        instagram="https://www.instagram.com/prathamesh_25_04"
        linkedin="https://www.linkedin.com/in/prathamesh-pabe-800109285"
        phone="9503583713"
      />
    </>
  );
};

const Modal = ({ id, name, img, description, goals, email, instagram, linkedin, phone }) => (
  <div id={id} className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => closeModal(id)}>&times;</span>
      <img src={img} alt={name} className="modal-img" />
      <h2>{name}</h2>
      <p><strong>Who I am:</strong> {description}</p>
      <p><strong>My goals:</strong> {goals}</p>
      <span className="modal-links">
        <a href={`https://mail.google.com/mail/?view=cm&to=${email}`} target="_blank" rel="noopener noreferrer" title={`Compose email to ${email}`}>✉️ {email}</a> |
        <a href={instagram} target="_blank" rel="noopener noreferrer">📸 Instagram</a> |
        <a href={linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a> |
        📞 <a href={`tel:+91${phone}`}>+91 {phone}</a>
      </span>
    </div>
  </div>
);

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

export default Modals;
