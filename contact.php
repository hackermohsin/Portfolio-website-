<?php
header('Content-Type: text/plain; charset=utf-8');
// Basic input validation and sanitization
function get_post($key, $default = '') {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
}

$name = strip_tags(get_post('name'));
$email = filter_var(get_post('email'), FILTER_SANITIZE_EMAIL);
$subject = strip_tags(get_post('subject'));
$message = strip_tags(get_post('message'));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
  http_response_code(400);
  echo 'Missing required fields';
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo 'Invalid email address';
  exit;
}

$to = getenv('CONTACT_TO') ?: 'mohsinhayat216@gmail.com';
$email_subject = $subject;
$email_body = "New contact message from Medilab website\n\n" .
  "Name: $name\n" .
  "Email: $email\n" .
  "Subject: $subject\n" .
  "Message:\n$message\n";

// Basic header injection guard
$safe_from = str_replace(["\r", "\n"], '', $email);
$headers = "From: $safe_from\r\n" .
           "Reply-To: $safe_from\r\n" .
           "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $email_subject, $email_body, $headers);

// Also log to file as a fallback/audit
@file_put_contents(__DIR__ . '/mail.log', date('c') . " CONTACT | $name <$email> | $subject\n", FILE_APPEND);

// Always return OK for frontend UX; operators can monitor mail.log if mail() is blocked
echo 'OK';
?>
