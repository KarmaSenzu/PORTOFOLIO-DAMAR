-- Portfolio CMS Database Schema

-- Admin users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_en VARCHAR(500) NOT NULL,
  title_id VARCHAR(500) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  about_en TEXT,
  about_id TEXT,
  category ENUM('web-app', 'mobile', 'open-source', 'design') DEFAULT 'web-app',
  role ENUM('frontend', 'backend', 'fullstack') DEFAULT 'fullstack',
  tech_stack JSON,
  images JSON,
  live_url VARCHAR(500),
  repo_url VARCHAR(500),
  date VARCHAR(100),
  duration VARCHAR(100),
  status ENUM('completed', 'in-progress', 'planned') DEFAULT 'completed',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  case_study_problem_en TEXT,
  case_study_problem_id TEXT,
  case_study_solution_en TEXT,
  case_study_solution_id TEXT,
  case_study_result_en TEXT,
  case_study_result_id TEXT,
  challenges JSON,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_en VARCHAR(500) NOT NULL,
  title_id VARCHAR(500) NOT NULL,
  excerpt_en TEXT,
  excerpt_id TEXT,
  content_en LONGTEXT,
  content_id LONGTEXT,
  category ENUM('tutorials', 'tips', 'thoughts') DEFAULT 'tutorials',
  tags JSON,
  image VARCHAR(500),
  read_time INT DEFAULT 5,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  category ENUM('frontend', 'backend', 'devops', 'design', 'tools') DEFAULT 'frontend',
  color VARCHAR(20),
  sort_order INT DEFAULT 0
);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(300) NOT NULL,
  title_id VARCHAR(300) NOT NULL,
  company VARCHAR(300),
  period_en VARCHAR(100),
  period_id VARCHAR(100),
  description_en TEXT,
  description_id TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  is_education BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(300) NOT NULL,
  title_id VARCHAR(300) NOT NULL,
  issuer VARCHAR(200),
  date VARCHAR(100),
  credential_id VARCHAR(200),
  image VARCHAR(500),
  credential_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

-- Site settings (key-value store for hero images, hobbies, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type ENUM('page_view', 'demo_click', 'repo_click') NOT NULL,
  page VARCHAR(200),
  project_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
