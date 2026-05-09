import axios from "axios";

export const sendWhatsAppOTP = async (phone, otp, name = "User") => {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: `91${phone}`, // India format
                type: "template",
                template: {
                    name: "hello_world",
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: name },
                                { type: "text", text: otp }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("WhatsApp OTP sent:", response.data);
        return true;
    } catch (error) {
        console.error("WhatsApp OTP Error:", error.response?.data || error.message);
        return false;
    }
};