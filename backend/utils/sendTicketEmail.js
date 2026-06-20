const transporter = require("./mailer"); 

const sendTicketEmail = async (userEmail, userName, matchDetails) => {
  try {
    const eventTitle = matchDetails?.title || "Tournament Match";
    const eventDate = matchDetails?.date || "Scheduled Date";
    const eventTime = matchDetails?.time ? `@ ${matchDetails.time}` : '';
    const eventLocation = matchDetails?.location || "Sports Connect Arena";
    const rosterId = matchDetails?._id ? matchDetails._id.toString().substring(18).toUpperCase() : "PENDING";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 10px; margin: 0; min-width: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border: 3px solid #06b6d4; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border-collapse: separate;">
          
          <tr>
            <td align="center" style="background-color: #06b6d4; padding: 35px 20px; text-align: center;">
              <p style="text-transform: uppercase; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; margin: 0 0 6px 0; color: #ffffff; opacity: 0.95;">Official Entry Ticket</p>
              <h1 style="font-size: 26px; font-weight: 900; text-transform: uppercase; font-style: italic; margin: 0; color: #ffffff; letter-spacing: 0.02em;">SLOT LOCKED IN! 🎟️</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px 30px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #334155; margin-top: 0; margin-bottom: 12px;">Hey <b>${userName}</b>,</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Your match registration pass has been verified on the roster. Your digital placement ticket is ready below:
              </p>
              
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px dashed #06b6d4; border-radius: 20px; padding: 22px; margin-bottom: 25px;">
                <tr>
                  <td>
                    <p style="font-size: 10px; font-weight: 900; color: #06b6d4; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 0.1em;">Sports Connect Bracket Pass</p>
                    <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin: 0 0 15px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; text-transform: capitalize;">
                      ${eventTitle}
                    </h2>
                    
                    <p style="font-size: 13px; color: #334155; margin: 10px 0; line-height: 1.4;">
                      <span style="font-size: 14px; margin-right: 8px;">📅</span><strong>Date / Time:</strong> ${eventDate} ${eventTime}
                    </p>
                    <p style="font-size: 13px; color: #334155; margin: 10px 0; line-height: 1.4;">
                      <span style="font-size: 14px; margin-right: 8px;">📍</span><strong>Arena Location:</strong> ${eventLocation}
                    </p>
                    
                    <table width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e2e8f0; margin-top: 15px; padding-top: 15px;">
                      <tr>
                        <td align="left" style="font-size: 11px; font-weight: bold; color: #0f172a; text-transform: uppercase; vertical-align: middle;">
                          Roster ID: #${rosterId}
                        </td>
                        <td align="right" style="vertical-align: middle;">
                          <span style="font-size: 10px; font-weight: 900; color: #06b6d4; text-transform: uppercase; background-color: #ecfeff; border: 1px solid #22d3ee; padding: 6px 12px; border-radius: 8px; display: inline-block; letter-spacing: 0.02em;">
                            CONFIRMED ATTENDEE
                          </span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 25px; margin-bottom: 0; line-height: 1.5;">
                Please display this email confirmation pass to coordinators at the arena venue desk.
              </p>
            </td>
          </tr>
          
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: '"Sports Connect 🏆" <sportsconnectteamindia@gmail.com>',
      to: userEmail,
      subject: `🎟️ Roster Ticket Secured: ${eventTitle}`,
      html: htmlContent, 
    });
    
    console.log(`✅ Digital pass ticket safely pushed to inbox for: ${userEmail}`);
  } catch (error) {
    console.error("❌ Ticket processing failed:", error.message);
  }
};

module.exports = sendTicketEmail;