const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Order Verification OTP - Buffs Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Verification</h2>
          <p>Hi,</p>
          <p>Your One-Time Password (OTP) for order verification is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #e74c3c; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Do not share this OTP with anyone.</p>
          <br>
          <p>Best regards,<br><strong>Buffs Restaurant Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP');
  }
};

const sendOrderNotification = async (email, orderNumber, status) => {
  try {
    const statusMessages = {
      pending: 'Your order has been received and is pending confirmation.',
      preparing: 'Your order is being prepared.',
      'out for delivery': 'Your order is out for delivery.',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Update - ${orderNumber} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Hi,</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Status:</strong> <span style="color: #e74c3c; text-transform: uppercase;">${status}</span></p>
          <p>${statusMessages[status]}</p>
          <br>
          <p>Thank you for your order!<br><strong>Buffs Restaurant Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send notification');
  }
};

const sendContactFormEmail = async (name, email, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A4189;">New Contact Form Submission</h2>
          <div style="background-color: #f9f5ed; padding: 20px; border-radius: 8px; border-left: 4px solid #1A4189;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
          </div>
          <br>
          <p style="color: #666; font-size: 12px;">This is an automated message from your Buffs Restaurant website.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send contact form email');
  }
};

const sendAdminOrderNotification = async (adminEmail, order, customerInfo) => {
  try {
    // Format order items for email
    const itemsList = order.items
      .map(item => {
        let itemDetails = `<li><strong>${item.productName}</strong> x${item.quantity} - ₱${item.itemTotal.toFixed(2)}`;
        
        if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
          const variants = Object.entries(item.selectedVariants)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          itemDetails += `<br><span style="color: #666; font-size: 12px;">Variants: ${variants}</span>`;
        }
        
        if (item.selectedAddons && item.selectedAddons.length > 0) {
          const addons = item.selectedAddons.map(a => a.name).join(', ');
          itemDetails += `<br><span style="color: #666; font-size: 12px;">Add-ons: ${addons}</span>`;
        }
        
        itemDetails += '</li>';
        return itemDetails;
      })
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `🔔 New Order #${order.orderNumber} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1A4189 0%, #2356b4 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">New Order Received</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Order #${order.orderNumber}</p>
          </div>

          <div style="background-color: #f9f5ed; padding: 30px; border-radius: 0 0 12px 12px;">
            <!-- Customer Information -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1A4189;">
              <h2 style="margin-top: 0; color: #1A4189;">Customer Information</h2>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${customerInfo.name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${customerInfo.email}" style="color: #FE601C;">${customerInfo.email}</a></p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${customerInfo.phone}" style="color: #FE601C;">${customerInfo.phone}</a></p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${customerInfo.address}</p>
            </div>

            <!-- Order Items -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #1A4189;">Order Items</h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${itemsList}
              </ul>
            </div>

            <!-- Order Summary -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #1A4189;">Order Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subtotal:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₱${order.subtotal.toFixed(2)}</td>
                </tr>
                ${order.tax > 0 ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Tax:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₱${order.tax.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Delivery Fee:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₱${order.deliveryFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 16px;"><strong>Total:</strong></td>
                  <td style="padding: 12px 0; text-align: right; font-size: 16px; color: #FE601C;"><strong>₱${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            <!-- Delivery Address -->
            <div style="background-color: #ebeff7; padding: 20px; border-radius: 8px; border-left: 4px solid #1A4189;">
              <h3 style="margin-top: 0; color: #1A4189;">📍 Delivery Address</h3>
              <p style="margin: 0; line-height: 1.6;">${order.deliveryAddress}</p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin/orders'}" style="display: inline-block; background: linear-gradient(to right, #1A4189, #2356b4); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Order in Dashboard
              </a>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>This is an automated notification from Buffs Restaurant ordering system.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Admin email notification error:', error);
    throw new Error('Failed to send admin notification');
  }
};

module.exports = { sendOTP, sendOrderNotification, sendContactFormEmail, sendAdminOrderNotification, transporter };
