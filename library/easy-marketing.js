const express = require('express');
const db = require('../config/db2');
const easyMarketing = require('@bangladeshisoftwarecao/easy-marketing-by-bs');
const authenticateJWT = require('../middleware/authMiddleware');

/*
Note: if you have a any middleware, like: auth, role or etc. then import it and use that route
*/

// Init library
async function init() {
  await easyMarketing.migrate(db);
}

init();

// Define all route.
const router = express.Router();

// Routes

router.route('/').get(authenticateJWT, async (req, res) => {
  res.status(200).json({ message: 'Welcome to Easy Marketing.' });
});

// storage config
router.post(
  '/upload_file',
  authenticateJWT,
  easyMarketing.upload_file.Upload('file'),
  (req, res) => {
    res.status(201).json({
      path: req.filename,
      url: req.filelink,
    });
  },
);

// get smtp settings
router.route('/smtp_setting').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query; // search, page, limit
    const response = await easyMarketing.email_config.getEmailConfigs(
      query,
      db,
    );
    res.status(200).json({
      message: response?.message || 'SMTP getting!',
      success: response.success,
      response,
    });
  } catch (error) {
    res.status(400).json({ message: error || 'SMTP getting error.' });
  }
});

// smtp creating
router.route('/smtp_setting').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;
    const response = await easyMarketing.email_config.createEmailConfig(
      body,
      db,
    );
    res.status(201).json({
      message: response?.message || 'SMTP Creating error!',
      success: response.success,
    });
  } catch (error) {
    res.status(400).json({ message: error || 'SMTP creating error.' });
  }
});

// smtp update

router.route('/smtp_setting/:id').put(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'SMTP id is required',
      });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    const response = await easyMarketing.email_config.updateEmailConfig(
      id,
      body,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMTP updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'SMTP update error!',
    });
  }
});

// smtp delete

router.route('/smtp_setting/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'SMTP id is required',
      });
    }

    const response = await easyMarketing.email_config.deleteEmailConfig(id, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMTP deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'SMTP delete error!',
    });
  }
});

// sms config get.
router.route('/sms_config').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query; // search, page, limit
    const response = await easyMarketing.sms.getSmsConfig(db);
    res.status(200).json({
      message: response?.message || 'config getting!',
      success: response.success,
      data: response,
    });
  } catch (error) {
    res.status(400).json({ message: error || 'config getting error.' });
  }
});

// sms config save.
router.route('/save_sms_config').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required.',
      });
    }

    // required validation
    if (!body.provider_name) {
      return res.status(400).json({
        success: false,
        message: 'Provider name is required.',
      });
    }

    const response = await easyMarketing.sms_config.saveSMSConfig(body, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message,
      type: response.type || null,
      insert_id: response.insert_id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'SMS config save error',
    });
  }
});

// get internal email template.
router.route('/html_email_template').post(authenticateJWT, async (req, res) => {
  try {
    const {
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
      subject,
    } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ message: 'Required field are missing!' });
    }

    // if you want to apply generate template of easy marketing.

    const html_template = easyMarketing.email_ui({
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
      subject,
    });

    res.status(200).json({
      success: true,
      message: 'Email ui getting successfully',
      data: html_template,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Email sending error!',
      success: false,
    });
  }
});

// send email.
router.route('/send_email').post(authenticateJWT, async (req, res) => {
  try {
    const {
      to,
      subject,
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
    } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ message: 'Required field are missing!' });
    }

    // if you want to apply generate template of easy marketing.

    const html_template = easyMarketing.email_ui({
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
      subject,
    });

    const response = await easyMarketing.email.sendEmail(db, {
      to,
      subject,
      html: html_template,
    });
    if (response.success) {
      await easyMarketing.email_history.createEmailHistory(
        {
          html: html_template,
          subject: subject,
          emails: JSON.stringify([to]),
        },
        db,
      );
    }
    res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Email sending error!',
      success: false,
    });
  }
});

// send bulk email.
router.route('/send_bulk_email').post(authenticateJWT, async (req, res) => {
  try {
    const {
      emails,
      subject,
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
    } = req.body;

    if (!emails || !subject || !body) {
      return res.status(400).json({
        message: 'Required field are missing!',
      });
    }

    // General html email ui
    const html_template = easyMarketing.email_ui({
      bg_color,
      logo,
      footer_line_1,
      footer_line_2,
      footer_line_3,
      footer_line_4,
      logo_bg_color,
      is_logo_bg_active,
      body,
      subject,
    });

    const emailsArray = Array.isArray(emails) ? emails : [emails];

    const response = await easyMarketing.email.sendBulkEmail(db, {
      emails: emailsArray,
      subject,
      html: html_template,
    });

    // save only success emails
    if (response.success && response.results?.length > 0) {
      const successEmails = response.results
        .filter((item) => item.success)
        .map((item) => item.email);

      if (successEmails.length > 0) {
        await easyMarketing.email_history.createEmailHistory(
          {
            html: html_template,
            subject,
            emails: JSON.stringify(successEmails),
          },
          db,
        );
      }
    }

    res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Bulk Email sent successfully',
      result: response.results || [],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Bulk Email sending error!',
      success: false,
    });
  }
});

// black, white email.

// send sms
router.route('/send_sms').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body?.number || !body?.message) {
      return res.status(400).json({
        success: false,
        message: 'Number and message are required',
      });
    }

    const response = await easyMarketing.sms.sendSms(db, {
      number: body.number,
      message: body.message,
    });

    // save sms history
    if (response.success) {
      await easyMarketing.sms_history.createSmsHistory(
        {
          text: body.message,
          cost: response?.response?.broadcast_sms_count || null,
          numbers: JSON.stringify([body.number]),
        },
        db,
      );
    }

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message:
        response?.response?.message ||
        response.message ||
        'SMS sent successfully',
      result: response.response || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// send bulk sms
router.route('/send_bulk_sms').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.numbers) || body.numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Numbers (array) is required',
      });
    }

    if (!body.message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const response = await easyMarketing.sms.sendBulkSms(db, {
      numbers: body.numbers,
      message: body.message,
    });

    if (response.success) {
      await easyMarketing.sms_history.createSmsHistory(
        {
          text: body.message,
          cost: response?.response?.broadcast_sms_count || null,
          numbers: JSON.stringify(response?.response?.numbers || body.numbers),
        },
        db,
      );
    }

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message:
        response?.response?.message ||
        response.message ||
        'SMS sent successfully',
      result: response.response || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// email group

router.route('/email_group').post(authenticateJWT, async (req, res) => {
  try {
    // create
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    if (!body.emails) {
      return res.status(400).json({
        success: false,
        message: 'Emails are required',
      });
    }

    // support single email or array
    const emailsArray = Array.isArray(body.emails)
      ? body.emails
      : [body.emails];

    // remove empty + duplicate
    const formattedEmails = emailsArray
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => email)
      .filter((email, index, arr) => arr.indexOf(email) === index);

    if (formattedEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid emails found',
      });
    }

    const response = await easyMarketing.email_group.createEmailGroup(
      {
        name: body.name,
        emails: JSON.stringify(formattedEmails),
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
        type: body.type || 'general',
      },
      db,
    );

    return res.status(response.success ? 201 : 400).json({
      success: response.success,
      message: response.message || 'Email group created successfully',
      insert_id: response.insert_id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// update email group
router.route('/email_group/:id').put(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    if (!body.emails) {
      return res.status(400).json({
        success: false,
        message: 'Emails are required',
      });
    }

    // support single email or array
    const emailsArray = Array.isArray(body.emails)
      ? body.emails
      : [body.emails];

    // clean + unique emails
    const formattedEmails = emailsArray
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => email)
      .filter((email, index, arr) => arr.indexOf(email) === index);

    if (formattedEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid emails found',
      });
    }

    const response = await easyMarketing.email_group.updateEmailGroup(
      id,
      {
        name: body.name,
        emails: JSON.stringify(formattedEmails),
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
        type: body.type || 'general',
      },
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email group updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete email group

router.route('/email_group/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    const response = await easyMarketing.email_group.deleteEmailGroup(id, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email group deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// bulk delete email groups

router.route('/email_group').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    // remove duplicate ids
    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response = await easyMarketing.email_group.bulkDeleteEmailGroups(
      uniqueIds,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email groups deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get all email groups

router.route('/email_group').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.email_group.getEmailGroups(query, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get single email group by id

router.route('/email_group/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    const response = await easyMarketing.email_group.getEmailGroupById(id, db);

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'Email group fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

router.route('/email_group_options').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query; // type, search

    const response = await easyMarketing.email_group.getEmailGroupsOption(
      query,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'Email group fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// sms

// create sms group

router.route('/sms_group').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    if (!body.numbers) {
      return res.status(400).json({
        success: false,
        message: 'Numbers are required',
      });
    }

    // support single number or array
    const numbersArray = Array.isArray(body.numbers)
      ? body.numbers
      : [body.numbers];

    // clean + unique numbers
    const formattedNumbers = numbersArray
      .map((number) => String(number).replace(/\D/g, ''))
      .map((number) => {
        if (number.startsWith('01')) {
          return `880${number}`;
        }

        if (!number.startsWith('880')) {
          return `880${number}`;
        }

        return number;
      })
      .filter((number) => number.length === 13)
      .filter((number, index, arr) => arr.indexOf(number) === index);

    if (formattedNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid numbers found',
      });
    }

    const response = await easyMarketing.sms_group.createSmsGroup(
      {
        name: body.name,
        numbers: JSON.stringify(formattedNumbers),
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
        type: body.type || 'general',
      },
      db,
    );

    return res.status(response.success ? 201 : 400).json({
      success: response.success,
      message: response.message || 'SMS group created successfully',
      insert_id: response.insert_id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// update sms group

router.route('/sms_group/:id').put(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    if (!body.numbers) {
      return res.status(400).json({
        success: false,
        message: 'Numbers are required',
      });
    }

    const numbersArray = Array.isArray(body.numbers)
      ? body.numbers
      : [body.numbers];

    const formattedNumbers = numbersArray
      .map((number) => String(number).replace(/\D/g, ''))
      .map((number) => {
        if (number.startsWith('01')) {
          return `880${number}`;
        }

        if (!number.startsWith('880')) {
          return `880${number}`;
        }

        return number;
      })
      .filter((number) => number.length === 13)
      .filter((number, index, arr) => arr.indexOf(number) === index);

    if (formattedNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid numbers found',
      });
    }

    const response = await easyMarketing.sms_group.updateSmsGroup(
      id,
      {
        name: body.name,
        numbers: JSON.stringify(formattedNumbers),
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
        type: body.type || 'general',
      },
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS group updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete sms group

router.route('/sms_group/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    const response = await easyMarketing.sms_group.deleteSmsGroup(id, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS group deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// bulk delete sms groups

router.route('/sms_group').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response = await easyMarketing.sms_group.bulkDeleteSmsGroups(
      uniqueIds,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS groups deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get all sms groups

router.route('/sms_group').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.sms_group.getSmsGroups(query, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get sms group options

router.route('/sms_group_options').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.sms_group.getSmsGroupsOption(
      query,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'SMS group options fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// sms group by id.

router.route('/sms_group/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Group id is required',
      });
    }

    const response = await easyMarketing.sms_group.getSmsGroupById(id, db);

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'SMS group fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// template and history:pagination.
// create email template

router.route('/email_template').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Template name is required',
      });
    }

    if (!body.subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
      });
    }

    if (!body.body) {
      return res.status(400).json({
        success: false,
        message: 'Email body is required',
      });
    }

    const response = await easyMarketing.email_template.createEmailTemplate(
      {
        name: body.name,
        subject: body.subject,
        body: body.body,
        footer_line_1: body.footer_line_1 || null,
        footer_line_2: body.footer_line_2 || null,
        footer_line_3: body.footer_line_3 || null,
        footer_line_4: body.footer_line_4 || null,
        logo_bg_color: body.logo_bg_color || null,
        is_logo_bg_active: body.is_logo_bg_active || 0,
        bg_color: body.bg_color || null,
        logo: body.logo || null,
        type: body.type || 'general',
        adderId: body.adderId || null,
      },
      db,
    );

    return res.status(response.success ? 201 : 400).json({
      success: response.success,
      message: response.message || 'Email template created successfully',
      insert_id: response.insert_id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// update email template

router.route('/email_template/:id').put(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template id is required',
      });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    const response = await easyMarketing.email_template.updateEmailTemplate(
      id,
      {
        name: body.name,
        subject: body.subject,
        body: body.body,
        footer_line_1: body.footer_line_1 || null,
        footer_line_2: body.footer_line_2 || null,
        footer_line_3: body.footer_line_3 || null,
        footer_line_4: body.footer_line_4 || null,
        logo_bg_color: body.logo_bg_color || null,
        is_logo_bg_active: body.is_logo_bg_active || 0,
        bg_color: body.bg_color || null,
        logo: body.logo || null,
        type: body.type || 'general',
        adderId: body.adderId || null,
      },
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email template updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete email template

router
  .route('/email_template/:id')
  .delete(authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Template id is required',
        });
      }

      const response = await easyMarketing.email_template.deleteEmailTemplate(
        id,
        db,
      );

      return res.status(response.success ? 200 : 400).json({
        success: response.success,
        message: response.message || 'Email template deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Something went wrong!',
      });
    }
  });

// bulk delete email templates

router.route('/email_template').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response =
      await easyMarketing.email_template.bulkDeleteEmailTemplates(
        uniqueIds,
        db,
      );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email templates deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get all email templates

router.route('/email_template').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.email_template.getEmailTemplates(
      query,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get single email template by id

router.route('/email_template/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template id is required',
      });
    }

    const response = await easyMarketing.email_template.getEmailTemplateById(
      id,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'Email template fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get email template options

router
  .route('/email_template_options')
  .get(authenticateJWT, async (req, res) => {
    try {
      const query = req.query; // type and search.

      const response =
        await easyMarketing.email_template.getEmailTemplatesOption(query, db);

      return res.status(response.success ? 200 : 404).json({
        success: response.success,
        data: response.data || null,
        message:
          response.message || 'Email template options fetched successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Something went wrong!',
      });
    }
  });

/// sms template.

// create sms template

router.route('/sms_template').post(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.message) {
      return res.status(400).json({
        success: false,
        message: 'SMS message is required',
      });
    }

    const response = await easyMarketing.sms_template.createSmsTemplate(
      {
        message: body.message,
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
      },
      db,
    );

    return res.status(response.success ? 201 : 400).json({
      success: response.success,
      message: response.message || 'SMS template created successfully',
      insert_id: response.insert_id || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// update sms template

router.route('/sms_template/:id').put(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template id is required',
      });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Body data is required',
      });
    }

    if (!body.message) {
      return res.status(400).json({
        success: false,
        message: 'SMS message is required',
      });
    }

    const response = await easyMarketing.sms_template.updateSmsTemplate(
      id,
      {
        message: body.message,
        adderId: body.adderId || null,
        adderRole: body.adderRole || null,
        adderName: body.adderName || null,
      },
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS template updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete sms template

router.route('/sms_template/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template id is required',
      });
    }

    const response = await easyMarketing.sms_template.deleteSmsTemplate(id, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS template deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// bulk delete sms templates

router.route('/sms_template').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response = await easyMarketing.sms_template.bulkDeleteSmsTemplates(
      uniqueIds,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS templates deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get all sms templates

router.route('/sms_template').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.sms_template.getSmsTemplates(
      query,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get single sms template by id

router.route('/sms_template/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Template id is required',
      });
    }

    const response = await easyMarketing.sms_template.getSmsTemplateById(
      id,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'SMS template fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

router.route('/sms_template_options').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query; // search .

    const response = await easyMarketing.sms_template.getSmsTemplatesOption(
      query,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'SMS template options fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// history api's
// get all email histories

router.route('/email_history').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.email_history.getEmailHistories(
      query,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get summaries history of sent emails

router
  .route('/email_summaries_history')
  .get(authenticateJWT, async (req, res) => {
    try {
      const query = req.query;

      const response = await easyMarketing.email_history.getEmailSummary(
        query,
        db,
      );
      console.log('query:: ', query);
      return res.status(response.success ? 200 : 400).json({
        success: response.success,
        data: response.data || [],
        pagination: response.pagination || null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Something went wrong!',
      });
    }
  });

// get single email history by id

router.route('/email_history/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'History id is required',
      });
    }

    const response = await easyMarketing.email_history.getEmailHistoryById(
      id,
      db,
    );

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'Email history fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete email history

router.route('/email_history/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'History id is required',
      });
    }

    const response = await easyMarketing.email_history.deleteEmailHistory(
      id,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email history deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// bulk delete email histories

router.route('/email_history').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response = await easyMarketing.email_history.bulkDeleteEmailHistories(
      uniqueIds,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'Email histories deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// sms histories

// get all sms histories

router.route('/sms_history').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.sms_history.getSmsHistories(query, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get sms sent summaries info.

router
  .route('/sms_summaries_history')
  .get(authenticateJWT, async (req, res) => {
    try {
      const query = req.query;

      const response = await easyMarketing.sms_history.getSmsSummary(query, db);
      return res.status(response.success ? 200 : 400).json({
        success: response.success,
        data: response.data || [],
        pagination: response.pagination || null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Something went wrong!',
      });
    }
  });

// get sms balance.
router.route('/sms_balance').get(authenticateJWT, async (req, res) => {
  try {
    const query = req.query;

    const response = await easyMarketing.sms.getSmsBalance(db);
    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      data: response.data || [],
      response: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// get single sms history by id

router.route('/sms_history/:id').get(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'History id is required',
      });
    }

    const response = await easyMarketing.sms_history.getSmsHistoryById(id, db);

    return res.status(response.success ? 200 : 404).json({
      success: response.success,
      data: response.data || null,
      message: response.message || 'SMS history fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// delete sms history

router.route('/sms_history/:id').delete(authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'History id is required',
      });
    }

    const response = await easyMarketing.sms_history.deleteSmsHistory(id, db);

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS history deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// bulk delete sms histories

router.route('/sms_history').delete(authenticateJWT, async (req, res) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ids array is required',
      });
    }

    const uniqueIds = [
      ...new Set(body.ids.map((id) => Number(id)).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid ids found',
      });
    }

    const response = await easyMarketing.sms_history.bulkDeleteSmsHistories(
      uniqueIds,
      db,
    );

    return res.status(response.success ? 200 : 400).json({
      success: response.success,
      message: response.message || 'SMS histories deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Something went wrong!',
    });
  }
});

// Routes

module.exports = router;
