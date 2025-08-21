import { config } from "dotenv";
import { execSync } from "child_process";

// Load .env file
config();

// Validate environment variables
const sonarUrl = process.env.SONARQUBE_URL;
const sonarToken = process.env.SONARQUBE_TOKEN;

if (!sonarUrl || !sonarToken) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Validate URL format
if (!sonarUrl.startsWith("http://") && !sonarUrl.startsWith("https://")) {
  console.error("Invalid SONARQUBE_URL format");
  process.exit(1);
}

// Use hardcoded command with validated parameters
const command = `sonar-scanner -Dsonar.host.url="${sonarUrl}" -Dsonar.token="${sonarToken}"`;

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  console.error("Error running sonar-scanner:", error.message);
}
