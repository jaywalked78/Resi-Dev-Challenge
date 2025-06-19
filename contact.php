<?php
$pageTitle    = "Contact Us";
$contactName  = "Jane Smith";
$emailAddress = "contact@example.com";

$htmlBlock = <<EOT
<section class="contact-card">
  <h1>$pageTitle</h1>
  <p>
    <strong>Name:</strong> $contactName<br>
    <strong>Email:</strong> <a href="mailto:$emailAddress">$emailAddress</a>
  </p>
</section>
EOT

echo $htmlBlock;
?>
