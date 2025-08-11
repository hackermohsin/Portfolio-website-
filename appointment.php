<?php
header('Content-Type: text/plain; charset=utf-8');
function get_post($key, $default = '') {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
}

$name = strip_tags(get_post('name'));
$email = filter_var(get_post('email'), FILTER_SANITIZE_EMAIL);
$phone = strip_tags(get_post('phone'));
$date = strip_tags(get_post('date'));
$department = strip_tags(get_post('department'));
$doctor = strip_tags(get_post('doctor'));
$message = strip_tags(get_post('message'));

if ($name === '' || $email === '' || $phone === '' || $date === '' || $department === '' || $doctor === '') {
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
$email_subject = 'Online Appointment Request';
$email_body = "New appointment request from Medilab website\n\n" .
  "Name: $name\n" .
  "Email: $email\n" .
  "Phone: $phone\n" .
  "Preferred Date: $date\n" .
  "Department: $department\n" .
  "Doctor: $doctor\n" .
  "Message:\n$message\n";

$safe_from = str_replace(["\r", "\n"], '', $email);
$headers = "From: $safe_from\r\n" .
           "Reply-To: $safe_from\r\n" .
           "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $email_subject, $email_body, $headers);

@file_put_contents(__DIR__ . '/mail.log', date('c') . " APPOINTMENT | $name <$email> | $department | $doctor | $date\n", FILE_APPEND);

echo 'OK';
?>
