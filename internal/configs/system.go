package configs

import "github.com/caarlos0/env/v6"

type Config struct {
	RdsURL   string `env:"RDS_URL"`
	LLMToken string `env:"LLM_TOKEN"`
}

func Load() (Config, error) {
	var cfg Config
	if err := env.Parse(&cfg); err != nil {
		return Config{}, err
	}

	return cfg, nil
}
