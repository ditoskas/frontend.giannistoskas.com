import React, { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

interface ContactData {
  "contact.form-submit": string;
  "contact.info-title": string;
  "contact.social-title": string;
  "contact.message-title": string;
  "contact.placeholder.company": string;
  "contact.placeholder.email": string;
  "contact.placeholder.message": string;
  "contact.placeholder.name": string;
  "contact.placeholder.phone": string;
}

interface SocialItem {
  id: string;
  name: string;
  url: string;
  icon: string; // Contains SVG string
}

interface ContactViewProps {
  recaptchaKey?: string;
}

let cachedContactData: ContactData | null = null;
let cachedSocialData: SocialItem[] | null = null;

const ContactView: React.FC<ContactViewProps> = ({ recaptchaKey }) => {
  const [data, setData] = useState<ContactData | null>(cachedContactData);
  const [socials, setSocials] = useState<SocialItem[]>(cachedSocialData || []);
  const [loading, setLoading] = useState(!cachedContactData);

  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

  useEffect(() => {
    // Fetch Contact Content
    if (!cachedContactData) {
      setLoading(true);
      apiClient.get("/dynamic-section/contact")
        .then(({ data: resp }) => {
          if (resp && resp.data) {
            cachedContactData = resp.data;
            setData(resp.data);
          }
        })
        .catch((err) => console.error("ContactView fetch error:", err))
        .finally(() => setLoading(false));
    }

    // Fetch Social Links
    if (!cachedSocialData) {
      apiClient.get("/social")
        .then(({ data: resp }) => {
          if (resp && resp.data) {
            cachedSocialData = resp.data;
            setSocials(resp.data);
          }
        })
        .catch((err) => console.error("Social fetch error:", err));
    }
  }, []);

  // Handle reCAPTCHA v3 Script Loading
  useEffect(() => {
    if (!recaptchaKey) return;
    if (!document.querySelector(`script[src*="recaptcha/api.js?render=${recaptchaKey}"]`)) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [recaptchaKey]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("sending");
    try {
      let recaptchaToken = null;
      if (recaptchaKey && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute(recaptchaKey, { action: 'submit' }).then(resolve);
          });
        });
      }
      await apiClient.post("/submit-form/contact", { ...form, recaptchaToken });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
    }
  };

  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238.47402102695634!2d22.415732029584643!3d39.638891779122616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1358897951fa0207%3A0x5b2269dc535d1ea!2sGIANNIS%20TOSKAS!5e0!3m2!1sel!2sgr!4v1780418439366!5m2!1sel!2sgr";

  if (loading && !data) {
    return (
      <div className="h-full w-full flex items-center justify-start p-10">
        <div className="text-primary text-[16px] opacity-50 uppercase tracking-widest">
          Loading Contact Content...
        </div>
      </div>
    );
  }

  const d = data || {} as ContactData;

  return (
    <div className="h-full w-full flex items-center justify-start overflow-y-auto p-10">
      <div className="flex gap-10 flex-wrap items-start">

        {/* Map Section */}
        <div className="flex-none w-[780px] min-w-[300px] flex flex-col">
          <h1 className="text-primary text-[24px] tracking-[0.1em] mb-7 uppercase">
            {d["contact.info-title"] || "VISIT US"}
          </h1>
          <div className="h-[600px] bg-bg-input relative">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              src={embedUrl}
            ></iframe>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-none w-[300px] flex flex-col">
          <h1 className="text-primary text-[24px] tracking-[0.1em] mb-5 uppercase">
            {d["contact.message-title"] || "SEND A MESSAGE"}
          </h1>
          {status === "success" ? (
            <div className="text-primary text-[16px] leading-[2]">Thank you! Your message has been sent.</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                className="contact-input"
                placeholder={d["contact.placeholder.name"] || "Your Name"}
                value={form.name}
                onChange={set("name")}
                required
              />
              <input
                className="contact-input"
                placeholder={d["contact.placeholder.email"] || "Email Address"}
                value={form.email}
                onChange={set("email")}
                type="email"
                required
              />
              <input
                className="contact-input"
                placeholder={d["contact.placeholder.phone"] || "Phone Number"}
                value={form.phone}
                onChange={set("phone")}
              />
              <input
                className="contact-input"
                placeholder={d["contact.placeholder.company"] || "Company"}
                value={form.company}
                onChange={set("company")}
              />
              <textarea
                className="contact-input h-[120px] pt-2 resize-none"
                placeholder={d["contact.placeholder.message"] || "Your Message"}
                value={form.message}
                onChange={set("message")}
                required
              />

              {status === "error" && (
                <div className="text-red-500 text-[12px] mb-2 font-bold">
                  There was an error sending your message. Please try again.
                </div>
              )}

              <div className="text-right mt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`bg-primary text-bg-dark border-none w-[90px] h-[30px] font-bold text-[11px] tracking-[0.1em] cursor-pointer ${status === 'sending' ? 'opacity-60' : 'opacity-100'}`}
                >
                  {status === "sending" ? "…" : (d["contact.form-submit"] || "SEND")}
                </button>
              </div>
            </form>
          )}

          {/* Social Links */}
          {socials.length > 0 && (
              <div>
                <h1 className="text-primary text-[24px] tracking-[0.1em] mb-7 uppercase">
                  {d["contact.social-title"] || "SOCIAL"}
                </h1>
                <div className="mt-8 flex gap-4 flex-wrap">
                  {socials.map((social) => (
                      <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity social-icon-link"
                          title={social.name}
                          dangerouslySetInnerHTML={{ __html: social.icon }}
                      />
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>

      <style>{`
        .social-icon-link svg {
          width: 100%;
          height: 100%;
          fill: #8c6a45;
        }
      `}</style>
    </div>
  );
};

export default ContactView;