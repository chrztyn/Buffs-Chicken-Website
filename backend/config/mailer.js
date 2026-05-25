const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@buffschicken.com';

const sendMail = ({ from, to, replyTo, subject, html }) =>
  transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    ...(replyTo ? { replyTo: Array.isArray(replyTo) ? replyTo.join(', ') : replyTo } : {}),
    subject,
    html,
  });

// ─── sendOTP ─────────────────────────────────────────────────────────────────

const sendOTP = async (email, otp) => {
  try {
    await sendMail({
      from: FROM_EMAIL,
      to: [email],
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
      `,
    });

    console.log('OTP email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Email sending error (sendOTP):', error);
    throw new Error('Failed to send OTP');
  }
};

// ─── sendOrderNotification ───────────────────────────────────────────────────

const sendOrderNotification = async (email, orderNumber, status) => {
  try {
    const statusMessages = {
      pending: 'Your order has been received and is pending confirmation.',
      preparing: 'Your order is being prepared.',
      'out for delivery': 'Your order is out for delivery.',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.',
    };

    await sendMail({
      from: FROM_EMAIL,
      to: [email],
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
      `,
    });

    console.log('Order notification sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Email sending error (sendOrderNotification):', error);
    throw new Error('Failed to send notification');
  }
};

// ─── sendContactFormEmail ────────────────────────────────────────────────────

const sendContactFormEmail = async (name, email, message) => {
  try {
    await sendMail({
      from: FROM_EMAIL,
      to: [process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@buffschicken.com'],
      replyTo: [email],
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
      `,
    });

    console.log('Contact form email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending error (sendContactFormEmail):', error);
    throw new Error('Failed to send contact form email');
  }
};

// ─── sendAdminOrderNotification ──────────────────────────────────────────────

const sendAdminOrderNotification = async (adminEmail, order, customerInfo) => {
  try {
    const itemsList = order.items
      .map((item) => {
        const productName = item.productName || 'Unknown Product';
        const quantity = item.quantity || 1;
        const itemTotal = item.itemTotal || 0;
        const selectedSauces = item.selectedSauces || [];
        const selectedAddons = item.selectedAddons || [];

        let itemHTML = `<li style="margin-bottom: 15px; line-height: 1.6;">
          <strong>${productName}</strong> x${quantity} - <strong style="color: #FE601C;">₱${parseFloat(itemTotal).toFixed(2)}</strong>`;

        if (selectedSauces.length > 0) {
          const sauces = selectedSauces.map((s) => s.name || s).join(', ');
          itemHTML += `<br><span style="color: #666; font-size: 13px; margin-left: 20px;">• Sauces: ${sauces}</span>`;
        }

        if (selectedAddons.length > 0) {
          const addons = selectedAddons.map((a) => a.name).join(', ');
          itemHTML += `<br><span style="color: #666; font-size: 13px; margin-left: 20px;">• ${addons}</span>`;
        }

        if (item.notes && item.notes.trim()) {
          itemHTML += `<br><span style="color: #92400e; font-size: 13px; margin-left: 20px; font-style: italic;">• Note: "${item.notes}"</span>`;
        }

        itemHTML += '</li>';
        return itemHTML;
      })
      .join('');

    await sendMail({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `New Order #${order.orderNumber} - Buffs Restaurant`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1A4189 0%, #2356b4 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">New Order Received</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Order #${order.orderNumber}</p>
          </div>

          <div style="background-color: #f9f5ed; padding: 30px; border-radius: 0 0 12px 12px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1A4189;">
              <h2 style="margin-top: 0; color: #1A4189;">Customer Information</h2>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${customerInfo.name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${customerInfo.email}" style="color: #FE601C;">${customerInfo.email}</a></p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${customerInfo.phone}" style="color: #FE601C;">${customerInfo.phone}</a></p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${customerInfo.address}</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #1A4189;">Order Items</h2>
              <ul style="list-style: disc; padding-left: 20px; margin: 0;">
                ${itemsList}
              </ul>
            </div>

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
                </tr>` : ''}
                ${order.voucher?.code ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #16a34a;">
                    <strong>Voucher (${order.voucher.code}):</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #16a34a;">
                    <strong>−₱${Number(order.voucher.discountAmount || 0).toFixed(2)}</strong>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 12px 0; font-size: 16px;"><strong>Total:</strong></td>
                  <td style="padding: 12px 0; text-align: right; font-size: 16px; color: #FE601C;"><strong>₱${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ebeff7; padding: 20px; border-radius: 8px; border-left: 4px solid #1A4189;">
              <h3 style="margin-top: 0; color: #1A4189;">Delivery Address</h3>
              <p style="margin: 0; line-height: 1.6;">${order.deliveryAddress}</p>
            </div>

            ${order.notes ? `
            <div style="background-color: #fff8ee; padding: 20px; border-radius: 8px; border-left: 4px solid #FE601C; margin-top: 20px;">
              <h3 style="margin-top: 0; color: #FE601C;">Special Instructions</h3>
              <p style="margin: 0; line-height: 1.6;">${order.notes}</p>
            </div>` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_DASHBOARD_URL || 'https://buffschicken.com/admin/orders'}"
                style="display: inline-block; background: linear-gradient(to right, #1A4189, #2356b4); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Order in Dashboard
              </a>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>This is an automated notification from Buffs Restaurant ordering system.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Admin order notification sent successfully to:', adminEmail);
    return true;
  } catch (error) {
    console.error('Admin email notification error:', error);
    throw new Error('Failed to send admin notification');
  }
};

module.exports = {
  sendOTP,
  sendOrderNotification,
  sendContactFormEmail,
  sendAdminOrderNotification,
  transporter, 
};