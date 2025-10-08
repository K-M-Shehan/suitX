package dev.doomsday.suitX.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service for sending emails
 * Handles welcome emails, password resets, notifications, etc.
 */
@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.name}")
    private String appName;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Send a welcome email to a new user
     * @param toEmail User's email address
     * @param username User's username
     */
    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to " + appName + "!");
            
            String htmlContent = buildWelcomeEmailContent(username);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            // Don't throw exception - email failure shouldn't prevent user registration
        }
    }
    
    /**
     * Build HTML content for welcome email
     */
    private String buildWelcomeEmailContent(String username) {
    return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #000000;
                    color: #ffffff;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 36px;
                    font-weight: bold;
                }
                .content {
                    padding: 40px 30px;
                    text-align: center;
                }
                .content h2 {
                    color: #000000;
                    margin-top: 0;
                    font-size: 24px;
                }
                .content p {
                    margin: 16px 0;
                    font-size: 16px;
                }
                .features {
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    padding: 20px;
                    margin: 24px auto;
                    max-width: 500px;
                    text-align: left;
                }
                .features ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .features li {
                    margin: 12px 0;
                    font-size: 15px;
                }
                .cta-button {
                    display: inline-block;
                    background-color: #000000;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 6px;
                    font-weight: 600;
                    margin: 24px 0;
                }
                .button-container {
                    text-align: center;
                    margin: 24px 0;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 24px 30px;
                    text-align: center;
                    font-size: 14px;
                    color: #6c757d;
                }
                .footer a {
                    color: #000000;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SuitX</h1>
                </div>
                <div class="content">
                    <h2>Welcome to SuitX, %s</h2>
                    <p>Thank you for joining SuitX — Your project's sixth sense.</p>
                    
                    <p>Your account has been successfully created. You can now start creating and managing projects, tracking progress, and receiving intelligent risk insights in real time.</p>
                    
                    <div class="features">
                        <strong>With SuitX, you can:</strong>
                        <ul>
                            <li>Create and manage multiple projects efficiently</li>
                            <li>Leverage AI-powered risk detection and analysis</li>
                            <li>Track tasks and monitor project progress</li>
                            <li>Receive automated mitigation strategies for potential risks</li>
                            <li>Access real-time risk dashboards and insights</li>
                            <li>Stay informed with smart notifications and alerts</li>
                        </ul>
                    </div>
                    
                    <p>Get started by creating your first project and exploring the SuitX dashboard.</p>
                    
                    <div class="button-container">
                        <a href="http://localhost:5173/launchpad" class="cta-button" style="color: #ffffff !important;">Go to Dashboard</a>
                    </div>
                    
                    <p style="margin-top: 32px; color: #6c757d; font-size: 14px;">
                        If you have any questions or need assistance, our support team is here to help.
                    </p>
                </div>
                <div class="footer">
                    <p>© 2025 SuitX. All rights reserved.</p>
                    <p>You received this email because you signed up for SuitX.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(username);
}

    
    /**
     * Send a generic email (for future use)
     * @param toEmail Recipient email
     * @param subject Email subject
     * @param content Email content (HTML)
     */
    public void sendEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", toEmail, e);
        }
    }
}
