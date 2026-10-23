// WhatsApp for the Services call to action. It is the same number the Contact
// section's WhatsApp link and the CV already publish (+54 9 358 412 0469, in
// wa.me format); the owner confirmed it for this use. Visitors who follow the
// link can see the number, as with the Contact link.
export const WHATSAPP_NUMBER = "5493584120469";

const link = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const servicesWhatsApp = {
  es: link("Hola Salvador! Vi tu portfolio y quisiera consultar por un proyecto web."),
  en: link("Hi Salvador! I saw your portfolio and I'd like to ask about a web project."),
};
