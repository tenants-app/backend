import mongoose from "mongoose";

require('dotenv').config()
const nodemailer = require("nodemailer");

const DutyOrder = mongoose.model('DutyOrder');
const User = mongoose.model('User');

export default {
    runCron: async () => {
        let today = new Date().toISOString()
        let orders = await DutyOrder.find().where('date').equals(today.slice(0, 10));
        if (orders.length) {
            await orders.forEach(async function (order) {
                let user = await User.findOne({_id: order.user});
                let transporter = nodemailer.createTransport({
                    service: "Gmail",
                    host: "smtp.ethereal.email",
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: '"Tenants <app.tenants@gmail.com>',
                    to: user.email,
                    subject: "Hello tenant",
                    text: "It is your cleaning-up turn today.",
                    html: "<b>It is your cleaning-up turn today.</b>"
                });
            });
        }
    },
}
