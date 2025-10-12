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
                    <h2>Welcome to SuitX, %s!</h2>
                    <p>Thank you for joining SuitX : Your project's sixth sense.</p>
                    
                    <p>Your account is ready. Start managing your projects with AI-powered risk insights.</p>
                    
                    <div class="features">
                        <strong>With SuitX, you can:</strong>
                        <ul>
                            <li>AI-powered risk detection</li>
                            <li>Real-time project tracking</li>
                            <li>Smart notifications and alerts</li>
                        </ul>
                    </div>
                    
                    <div class="button-container">
                        <a href="http://localhost:5173/launchpad" class="cta-button" style="color: #ffffff !important;">Get Started</a>
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

    /**
     * Send a task assignment email to a user
     * @param toEmail User's email address
     * @param username User's username
     * @param taskTitle Title of the task
     * @param projectName Name of the project
     * @param priority Task priority
     * @param dueDate Task due date
     * @param description Task description
     */
    public void sendTaskAssignmentEmail(String toEmail, String username, String taskTitle, 
                                       String projectName, String priority, String dueDate, String description) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("New Task Assigned: " + taskTitle);
            
            String htmlContent = buildTaskAssignmentEmailContent(username, taskTitle, projectName, 
                                                                priority, dueDate, description);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Task assignment email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send task assignment email to: {}", toEmail, e);
        }
    }

    /**
     * Build HTML content for task assignment email
     */
    private String buildTaskAssignmentEmailContent(String username, String taskTitle, 
                                                   String projectName, String priority, 
                                                   String dueDate, String description) {
        String priorityColor = switch (priority != null ? priority.toUpperCase() : "MEDIUM") {
            case "HIGH" -> "#dc2626";
            case "MEDIUM" -> "#f59e0b";
            case "LOW" -> "#10b981";
            default -> "#6b7280";
        };

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
                    }
                    .content h2 {
                        color: #000000;
                        margin-top: 0;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    .content p {
                        margin: 16px 0;
                        font-size: 16px;
                    }
                    .task-details {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 24px;
                        margin: 24px 0;
                    }
                    .task-details h3 {
                        margin: 0 0 16px 0;
                        font-size: 20px;
                        color: #000000;
                    }
                    .detail-row {
                        display: flex;
                        margin: 12px 0;
                        font-size: 15px;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #495057;
                        min-width: 100px;
                    }
                    .detail-value {
                        color: #212529;
                    }
                    .priority-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 14px;
                        color: #ffffff;
                        background-color: %s;
                    }
                    .description {
                        background-color: #ffffff;
                        border-left: 4px solid #000000;
                        padding: 16px;
                        margin: 16px 0;
                        font-size: 15px;
                        color: #495057;
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
                        <h2>New Task Assigned</h2>
                        <p>Hello %s,</p>
                        
                        <p>You have been assigned to a new task. Here are the details:</p>
                        
                        <div class="task-details">
                            <h3>📋 %s</h3>
                            
                            <div class="detail-row">
                                <span class="detail-label">Project:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Priority:</span>
                                <span class="priority-badge">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Due Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            %s
                        </div>
                        
                        <div class="button-container">
                            <a href="http://localhost:5173/launchpad" class="cta-button" style="color: #ffffff !important;">View Task</a>
                        </div>
                        
                        <p style="margin-top: 32px; color: #6c757d; font-size: 14px;">
                            Log in to SuitX to view full details, update progress, and collaborate with your team.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 SuitX. All rights reserved.</p>
                        <p>You received this email because you are a member of this project.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                priorityColor,
                username,
                taskTitle,
                projectName,
                priority != null ? priority : "Not set",
                dueDate != null && !dueDate.isEmpty() ? dueDate : "Not set",
                description != null && !description.isEmpty() 
                    ? "<div class=\"description\"><strong>Description:</strong><br>" + description + "</div>"
                    : ""
            );
    }

    /**
     * Send a project invitation email to a user
     * @param toEmail User's email address
     * @param username User's username
     * @param projectName Name of the project
     * @param invitedBy Username of the person who sent the invitation
     * @param message Optional personal message
     * @param expiryDate Invitation expiry date
     */
    public void sendProjectInvitationEmail(String toEmail, String username, String projectName, 
                                          String invitedBy, String message, String expiryDate) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("You've been invited to join " + projectName);
            
            String htmlContent = buildProjectInvitationEmailContent(username, projectName, 
                                                                    invitedBy, message, expiryDate);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Project invitation email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send project invitation email to: {}", toEmail, e);
        }
    }

    /**
     * Build HTML content for project invitation email
     */
    private String buildProjectInvitationEmailContent(String username, String projectName, 
                                                      String invitedBy, String message, String expiryDate) {
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
                    }
                    .content h2 {
                        color: #000000;
                        margin-top: 0;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    .content p {
                        margin: 16px 0;
                        font-size: 16px;
                    }
                    .invitation-card {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 24px;
                        margin: 24px 0;
                        border-left: 4px solid #000000;
                    }
                    .invitation-card h3 {
                        margin: 0 0 8px 0;
                        font-size: 20px;
                        color: #000000;
                    }
                    .invitation-card .project-name {
                        font-size: 18px;
                        font-weight: 600;
                        color: #495057;
                        margin-bottom: 16px;
                    }
                    .invitation-card .invited-by {
                        font-size: 15px;
                        color: #6c757d;
                        margin-bottom: 16px;
                    }
                    .message-box {
                        background-color: #ffffff;
                        border-radius: 6px;
                        padding: 16px;
                        margin: 16px 0;
                        font-size: 15px;
                        color: #495057;
                        font-style: italic;
                        border: 1px solid #dee2e6;
                    }
                    .expiry-notice {
                        background-color: #fff3cd;
                        border: 1px solid #ffc107;
                        border-radius: 6px;
                        padding: 12px 16px;
                        margin: 16px 0;
                        font-size: 14px;
                        color: #856404;
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
                        <h2>🎉 Project Invitation</h2>
                        <p>Hello %s,</p>
                        
                        <p>You've been invited to collaborate on an exciting project!</p>
                        
                        <div class="invitation-card">
                            <h3>Project Details</h3>
                            <div class="project-name">📂 %s</div>
                            <div class="invited-by">Invited by: <strong>%s</strong></div>
                            
                            %s
                        </div>
                        
                        <div class="expiry-notice">
                            ⏰ <strong>Note:</strong> This invitation expires on <strong>%s</strong>
                        </div>
                        
                        <div class="button-container">
                            <a href="http://localhost:5173/notifications" class="cta-button" style="color: #ffffff !important;">View Invitation</a>
                        </div>
                        
                        <p style="margin-top: 32px; color: #6c757d; font-size: 14px;">
                            Log in to SuitX to accept or decline this invitation. Join the team and start collaborating!
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 SuitX. All rights reserved.</p>
                        <p>You received this email because someone invited you to join their project.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                username,
                projectName,
                invitedBy,
                message != null && !message.isEmpty() 
                    ? "<div class=\"message-box\">\"" + message + "\"</div>"
                    : "",
                expiryDate
            );
    }

    /**
     * Send mitigation assignment email to a user
     */
    public void sendMitigationAssignmentEmail(String toEmail, String username, String mitigationTitle, 
                                             String projectName, String priority, String dueDate, String description) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("New Mitigation Assigned: " + mitigationTitle);
            
            String htmlContent = buildMitigationAssignmentEmailContent(username, mitigationTitle, projectName, 
                                                                       priority, dueDate, description);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Mitigation assignment email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send mitigation assignment email to: {}", toEmail, e);
        }
    }

    /**
     * Build HTML content for mitigation assignment email
     */
    private String buildMitigationAssignmentEmailContent(String username, String mitigationTitle, 
                                                        String projectName, String priority, 
                                                        String dueDate, String description) {
        // Ensure no null values
        username = username != null ? username : "User";
        mitigationTitle = mitigationTitle != null ? mitigationTitle : "Untitled Mitigation";
        projectName = projectName != null ? projectName : "Unknown Project";
        priority = priority != null ? priority : "MEDIUM";
        dueDate = dueDate != null && !dueDate.isEmpty() ? dueDate : "Not set";
        description = description != null ? description : "";
        
        System.out.println("DEBUG - Building email content:");
        System.out.println("  Username: " + username);
        System.out.println("  Title: " + mitigationTitle);
        System.out.println("  Project: " + projectName);
        System.out.println("  Priority: " + priority);
        System.out.println("  DueDate: " + dueDate);
        
        // Escape special characters in user-provided content to prevent HTML/formatting issues
        description = description.replace("\"", "&quot;").replace("'", "&#39;");
        mitigationTitle = mitigationTitle.replace("\"", "&quot;").replace("'", "&#39;");
        projectName = projectName.replace("\"", "&quot;").replace("'", "&#39;");
        
        String priorityColor = switch (priority.toUpperCase()) {
            case "CRITICAL" -> "#dc2626";
            case "HIGH" -> "#dc2626";
            case "MEDIUM" -> "#f59e0b";
            case "LOW" -> "#10b981";
            default -> "#6b7280";
        };
        
        System.out.println("  Priority Color: " + priorityColor);
        
        try {
            String content = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mitigation Assignment</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                    }
                    .header {
                        background: #000000;
                        padding: 32px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .content h2 {
                        color: #000000;
                        font-size: 24px;
                        margin-top: 0;
                        margin-bottom: 20px;
                    }
                    .content p {
                        margin: 16px 0;
                        color: #555;
                    }
                    .mitigation-details {
                        background-color: #f8f9fa;
                        border-left: 4px solid #000000;
                        padding: 24px;
                        margin: 24px 0;
                        border-radius: 4px;
                    }
                    .mitigation-details h3 {
                        margin-top: 0;
                        color: #000000;
                        font-size: 20px;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #e9ecef;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #495057;
                    }
                    .detail-value {
                        color: #212529;
                    }
                    .priority-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-weight: 600;
                        font-size: 13px;
                        color: #ffffff;
                        background-color: %s;
                    }
                    .description {
                        background-color: #ffffff;
                        padding: 16px;
                        margin-top: 16px;
                        border-radius: 4px;
                        border: 1px solid #dee2e6;
                    }
                    .button-container {
                        text-align: center;
                        margin: 32px 0;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #000000;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                    }
                    .cta-button:hover {
                        background-color: #333333;
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
                        <h2>New Mitigation Assigned</h2>
                        <p>Hello %s,</p>
                        
                        <p>You have been assigned to a new mitigation strategy. Here are the details:</p>
                        
                        <div class="mitigation-details">
                            <h3>🛡️ %s</h3>
                            
                            <div class="detail-row">
                                <span class="detail-label">Project:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Priority:</span>
                                <span class="priority-badge">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Due Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            %s
                        </div>
                        
                        <div class="button-container">
                            <a href="http://localhost:5173/mitigations" class="cta-button" style="color: #ffffff !important;">View Mitigation</a>
                        </div>
                        
                        <p style="margin-top: 32px; color: #6c757d; font-size: 14px;">
                            Log in to SuitX to view full details, update progress, and track the effectiveness of this mitigation strategy.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 SuitX. All rights reserved.</p>
                        <p>You received this email because you are a member of this project.</p>
                    </div>
                </div>
            </body>
            </html>
            """;
            
            System.out.println("DEBUG - About to format email with 7 parameters");
            String formattedContent = String.format(content,
                priorityColor,
                username,
                mitigationTitle,
                projectName,
                priority,
                dueDate,
                !description.isEmpty() 
                    ? "<div class=\"description\"><strong>Description:</strong><br>" + description + "</div>"
                    : ""
            );
            
            System.out.println("DEBUG - Email content generated successfully");
            return formattedContent;
        } catch (Exception e) {
            System.err.println("ERROR - Failed to format email template: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
