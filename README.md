# Easy Marketing by BS

Professional Email & SMS Marketing Solution for Node.js Applications.

Developed by Bangladeshi Software LTD.

---

## Installation

```bash
npm install @bangladeshisoftwarecao/easy-marketing-by-bs
```

---

# Basic Setup

```javascript
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./utils/db');

const easyMarketing = require(
  '@bangladeshisoftwarecao/easy-marketing-by-bs'
);

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  }),
);

// initialize migrations
async function init() {

  await easyMarketing.migrate(db);

}

init();
```

---

# SMTP Configuration

## Create SMTP

```javascript
app.post('/easy-marketing/smtp_setting', async (req, res) => {

  try {

    const response =
      await easyMarketing.email_config
        .createEmailConfig(
          req.body,
          db,
        );

    return res.status(201).json({
      success: response.success,
      message: response.message,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Send Single Email

```javascript
app.post('/easy-marketing/send-email', async (req, res) => {

  try {

    const { to, subject, html } =
      req.body;

    const response =
      await easyMarketing.email.sendEmail(
        db,
        {
          to,
          subject,
          html,
        },
      );

    return res.status(
      response.success ? 200 : 400,
    ).json(response);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Send Bulk Email

```javascript
app.post('/easy-marketing/send-bulk-email', async (req, res) => {

  try {

    const response =
      await easyMarketing.email
        .sendBulkEmail(
          db,
          {
            emails: req.body.emails,
            subject: req.body.subject,
            html: req.body.html,
          },
        );

    return res.status(
      response.success ? 200 : 400,
    ).json(response);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Save SMS Configuration

```javascript
app.post('/easy-marketing/save_sms_config', async (req, res) => {

  try {

    const response =
      await easyMarketing.sms_config
        .saveSMSConfig(
          req.body,
          db,
        );

    return res.status(
      response.success ? 200 : 400,
    ).json(response);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Send Single SMS

```javascript
app.post('/easy-marketing/send_sms', async (req, res) => {

  try {

    const response =
      await easyMarketing.sms.sendSms(
        db,
        {
          number: req.body.number,
          message: req.body.message,
        },
      );

    return res.status(
      response.success ? 200 : 400,
    ).json(response);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Send Bulk SMS

```javascript
app.post('/easy-marketing/send_bulk_sms', async (req, res) => {

  try {

    const response =
      await easyMarketing.sms.sendBulkSms(
        db,
        {
          numbers: req.body.numbers,
          message: req.body.message,
        },
      );

    return res.status(
      response.success ? 200 : 400,
    ).json(response);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});
```

---

# Email Group Example

```javascript
await easyMarketing.email_group
  .createEmailGroup(
    {
      name: 'Customer Group',

      emails: JSON.stringify([
        'user1@gmail.com',
        'user2@gmail.com',
      ]),

      type: 'customer',
    },

    db,
  );
```

---

# SMS Group Example

```javascript
await easyMarketing.sms_group
  .createSmsGroup(
    {
      name: 'Customer SMS Group',

      numbers: JSON.stringify([
        '01700000000',
        '01800000000',
      ]),

      type: 'customer',
    },

    db,
  );
```

---

# Features

* Email Marketing
* Bulk Email Sending
* SMS Marketing
* Bulk SMS Sending
* SMTP Management
* SMS Gateway Management
* Email Templates
* SMS Templates
* Email Groups
* SMS Groups
* Email & SMS History
* Production Ready
* MySQL2 Supported

---

# Developer

Muhmmad Nasim

Email:
[nasimranauser@gmail.com](mailto:nasimranauser@gmail.com)

---

# Company

Bangladeshi Software LTD.

---

# License

MIT
