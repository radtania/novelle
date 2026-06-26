package auth

import (
	"fmt"
	"net/mail"
	"unicode"
)

func validateRegister(name, email, password string) error {
	if err := validateName(name); err != nil {
		return err
	}
	if err := validateEmail(email); err != nil {
		return err
	}
	if err := validatePassword(password); err != nil {
		return err
	}
	return nil
}

func validateName(name string) error {
	if len(name) < 2 {
		return fmt.Errorf("numele trebuie să aibă cel puțin 2 caractere")
	}
	if len(name) > 50 {
		return fmt.Errorf("numele nu poate depăși 50 de caractere")
	}
	return nil
}

func validateEmail(email string) error {
	if _, err := mail.ParseAddress(email); err != nil {
		return fmt.Errorf("adresa de email nu este validă")
	}
	if len(email) > 100 {
		return fmt.Errorf("email-ul nu poate depăși 100 de caractere")
	}
	return nil
}

func validatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("parola trebuie să aibă cel puțin 8 caractere")
	}
	if len(password) > 64 {
		return fmt.Errorf("parola nu poate depăși 64 de caractere")
	}

	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, c := range password {
		switch {
		case unicode.IsUpper(c):
			hasUpper = true
		case unicode.IsLower(c):
			hasLower = true
		case unicode.IsDigit(c):
			hasDigit = true
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return fmt.Errorf("parola trebuie să conțină cel puțin o literă mare")
	}
	if !hasLower {
		return fmt.Errorf("parola trebuie să conțină cel puțin o literă mică")
	}
	if !hasDigit {
		return fmt.Errorf("parola trebuie să conțină cel puțin o cifră")
	}
	if !hasSpecial {
		return fmt.Errorf("parola trebuie să conțină cel puțin un caracter special")
	}

	return nil
}
