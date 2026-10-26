import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";
import "./our-philosophy-editorial.css";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=90";

export default function OurPhilosophyEditorial() {
  const [mediaType, setMediaType] = useState("photo");
  const [mediaUrl, setMediaUrl] = useState(DEFAULT_IMAGE);
  const [caption, setCaption] = useState("Content that isn't scrolled past");
  const [showEditor, setShowEditor] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  return (
    <section className="our-philosophy-editorial" id="philosophy">
      <div className="op-editorial__media">
        {mediaType === "video" ? (
          <video className="op-editorial__visual" src={mediaUrl} autoPlay muted loop playsInline />
        ) : (
          <img className="op-editorial__visual" src={mediaUrl || DEFAULT_IMAGE} alt="Fashion editorial campaign" />
        )}
        <button className="op-editorial__expand" aria-label="View media larger" onClick={() => setShowMedia(true)}><Maximize2 size={22} /></button>
        <button className="op-editorial__edit-media" onClick={() => setShowEditor((value) => !value)}>Edit media</button>

        {showEditor && (
          <div className="op-editorial__editor">
            <button className="op-editorial__editor-close" onClick={() => setShowEditor(false)} aria-label="Close media editor"><X size={17} /></button>
            <strong>Customize left media</strong>
            <label>Media type
              <select value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
                <option value="photo">Photo</option><option value="video">Video</option>
              </select>
            </label>
            <label>{mediaType === "video" ? "Video URL / public path" : "Photo URL"} 
              <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder={mediaType === "video" ? "/videos/philosophy.mp4" : "https://..."} />
            </label>
            <label>Overlay text
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={2} />
            </label>
            <small>For a local video, place it in public/videos and enter its path, e.g. /videos/philosophy.mp4.</small>
          </div>
        )}
      </div>

      <div className="op-editorial__content">
        <div className="op-editorial__eyebrow"><span /> OUR PHILOSOPHY</div>
        <h2>From a founder’s vision to a <em>brand people love.</em></h2>
        <p>Every brand starts with a why. Someone sees a gap, believes something can be better, and decides to create something of their own. We understand that journey because we’ve lived it ourselves. </p>
        <p>We started Socialure after seeing a gap in the agency world. Founders needed more than another agency delivering content and ticking off tasks. They needed a partner who understood their vision, cared about their product, and worked alongside them to create something meaningful. No templates, no unnecessary noise — just clear thinking and work with character.</p>
        <p>We bring that perspective from our own experience. Through our four sister D2C brands, we’ve generated crores in revenue and experienced firsthand what it takes to market, grow, and run a brand.</p>
        <div className="op-editorial__tags" aria-label="Our capabilities">
          <span>BRANDING</span><span>WEB DESIGN</span><span>CAMPAIGNS</span><span>CONTENT</span><span>AI CREATIVE</span>
        </div>
        <div className="op-editorial__links">
          <a href="#contact">Let’s talk <b>↗</b></a>
          <a href="#services">See how we work <b>→</b></a>
        </div>
      </div>

      {showMedia && <div className="op-editorial__lightbox" role="dialog" aria-modal="true" onClick={() => setShowMedia(false)}>
        <button aria-label="Close enlarged media" onClick={() => setShowMedia(false)}><X size={24} /></button>
        {mediaType === "video" ? <video src={mediaUrl} autoPlay muted loop controls playsInline onClick={(event) => event.stopPropagation()} /> : <img src={mediaUrl || DEFAULT_IMAGE} alt="Expanded fashion editorial" onClick={(event) => event.stopPropagation()} />}
      </div>}
    </section>
  );
}
