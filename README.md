# Easy Marketing by BS

Professional Email & SMS Marketing Solution for Node.js Applications.

Developed by Bangladeshi Software LTD.

---

# Features

- Email Marketing
- Bulk Email Sending
- SMS Marketing
- Bulk SMS Sending
- SMTP Management
- SMS Gateway Management
- Email Templates
- SMS Templates
- Email Groups
- SMS Groups
- Email & SMS History
- Email & SMS Analytics Summary
- Date Range Reporting
- Pagination Support
- Production Ready
- MySQL2 Supported

---

# Installation

```bash id="s1n4r9"
npm install @bangladeshisoftwarecao/easy-marketing-by-bs
```

---

# Basic Setup

```javascript id="q1p7zy"
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./utils/db');

const easyMarketing = require('@bangladeshisoftwarecao/easy-marketing-by-bs');

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

```javascript id="7xg4yo"
app.post('/easy-marketing/smtp_setting', async (req, res) => {
  try {
    const response = await easyMarketing.email_config.createEmailConfig(
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

```javascript id="m3hy7k"
app.post('/easy-marketing/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const response = await easyMarketing.email.sendEmail(db, {
      to,
      subject,
      html,
    });

    return res.status(response.success ? 200 : 400).json(response);
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

```javascript id="e5dz0g"
app.post('/easy-marketing/send-bulk-email', async (req, res) => {
  try {
    const response = await easyMarketing.email.sendBulkEmail(db, {
      emails: req.body.emails,
      subject: req.body.subject,
      html: req.body.html,
    });

    return res.status(response.success ? 200 : 400).json(response);
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

```javascript id="hrv4m2"
app.post('/easy-marketing/save_sms_config', async (req, res) => {
  try {
    const response = await easyMarketing.sms_config.saveSMSConfig(req.body, db);

    return res.status(response.success ? 200 : 400).json(response);
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

```javascript id="h5qf0d"
app.post('/easy-marketing/send_sms', async (req, res) => {
  try {
    const response = await easyMarketing.sms.sendSms(db, {
      number: req.body.number,
      message: req.body.message,
    });

    return res.status(response.success ? 200 : 400).json(response);
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

```javascript id="v2m8jc"
app.post('/easy-marketing/send_bulk_sms', async (req, res) => {
  try {
    const response = await easyMarketing.sms.sendBulkSms(db, {
      numbers: req.body.numbers,
      message: req.body.message,
    });

    return res.status(response.success ? 200 : 400).json(response);
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

```javascript id="j3o5wy"
await easyMarketing.email_group.createEmailGroup(
  {
    name: 'Customer Group',

    emails: JSON.stringify(['user1@gmail.com', 'user2@gmail.com']),

    type: 'customer',
  },

  db,
);
```

---

# SMS Group Example

```javascript id="xl8k2n"
await easyMarketing.sms_group.createSmsGroup(
  {
    name: 'Customer SMS Group',

    numbers: JSON.stringify(['01700000000', '01800000000']),

    type: 'customer',
  },

  db,
);
```

---

# Email Summary Example

```javascript id="x4nbwq"
const summary = await easyMarketing.email_history.getEmailSummary(
  {
    from_date: '2026-06-01',
    to_date: '2026-06-10',
  },
  db,
);
```

---

# SMS Summary Example

```javascript id="hf3d7m"
const summary = await easyMarketing.sms_history.getSmsSummary(
  {
    from_date: '2026-06-01',
    to_date: '2026-06-10',
  },
  db,
);
```

---

# Pagination Query Example

```bash id="wp8v3t"
?page=1&limit=10&search=test
```

---

# Date Range Query Example

```bash id="s7m2rx"
?from_date=2026-06-01&to_date=2026-06-10
```

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
