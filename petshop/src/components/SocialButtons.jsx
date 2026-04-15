import "./SocialButtons.css";

function SocialButtons() {
  return (
    <div className="social-float">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook">
        <img src="/images/fb_icon.png" alt="Facebook" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" title="Instagram">
        <img src="/images/insta_icon.jfif" alt="Instagram" />
        </a>
    </div>
  );
}

export default SocialButtons;