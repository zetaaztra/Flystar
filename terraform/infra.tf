provider "aws" {
  region     = "ap-southeast-1"
  access_key = "AKIAQEFWATCBDJJGVI4D"
  secret_key = "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"
}

resource "aws_instance" "my_web_app" {
  ami           = "ami-060e277c0d4cce553"
  instance_type = "t2.micro" 

  tags = {
    Environment = "production"
    Service     = "web-app"
  }

  root_block_device {
    volume_size = 30
    volume_type = "gp2" 
  }
}
