import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../assets/logo.svg';
import { authApi } from '../api/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.name.length < 2) { 
        setError('Numele trebuie să aibă cel puțin 2 caractere.'); return; 
    }
    if (form.password !== form.confirm) { 
        setError('Parolele nu coincid.'); return; 
    }
    if (form.password.length < 8) { 
        setError('Parola trebuie să aibă cel puțin 8 caractere.'); return; 
    }
    if (!/[A-Z]/.test(form.password)) { 
        setError('Parola trebuie să conțină cel puțin o literă mare.'); return; 
    }
    if (!/[a-z]/.test(form.password)) { 
        setError('Parola trebuie să conțină cel puțin o literă mică.'); return; 
    }
    if (!/[0-9]/.test(form.password)) { 
        setError('Parola trebuie să conțină cel puțin o cifră.'); return; 
    }
    if (!/[^A-Za-z0-9]/.test(form.password)) { 
        setError('Parola trebuie să conțină cel puțin un caracter special.'); return; 
    }

    setLoading(true);
    try {
        await authApi.register(form.name, form.email, form.password);
        navigate('/login');
    } catch (err) {
        setError(err.message || 'Înregistrare eșuată. Încearcă din nou.');
    } finally {
        setLoading(false);
    }
};

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#1e1209' }}>

      {/* Left brand panel */}
      <Box sx={{
        width: '42%', bgcolor: '#2e1a0e',
        borderRight: '1px solid #3d2a18',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        p: '48px 40px',
      }}>
        <img src={logo} alt="Novelle" style={{ width: '36px', height: '36px', marginBottom: '16px', filter: 'invert(60%) sepia(40%) saturate(400%) hue-rotate(10deg)' }} />
        <Ornament />
        <Typography sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 46, fontWeight: 600, color: '#D5B38E',
          letterSpacing: 4, mb: 0.5, lineHeight: 1,
        }}>
          Novelle
        </Typography>
        <Typography sx={{
          fontSize: 11, color: '#6b4f36',
          letterSpacing: 2.5, textTransform: 'uppercase', mb: 5,
        }}>
          Personalized by AI, Inspired by You
        </Typography>
        <Box sx={{ width: '100%', height: '1px', bgcolor: '#3d2a18', mb: 4 }} />
        <Typography sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: 'italic', fontSize: 15,
          color: '#6b4f36', textAlign: 'center',
          lineHeight: 1.8, maxWidth: 240, mb: 4,
        }}>
          <Box component="span" sx={{ fontSize: 28, color: '#A57650', lineHeight: 1, mr: 0.5, verticalAlign: 'middle' }}>&ldquo;</Box>
          Not all those who wander are lost — some are just between chapters.
          <Box component="span" sx={{ fontSize: 28, color: '#A57650', lineHeight: 1, ml: 0.5, verticalAlign: 'middle' }}>&rdquo;</Box>
        </Typography>
        
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1, bgcolor: '#f7f0e6',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', p: '48px 64px',
      }}>
        <Box sx={{ display: 'flex', borderBottom: '1.5px solid #D5B38E', mb: 4.5 }}>
          <TabItem label="Sign in" active={false} to="/login" />
          <TabItem label="Create account" active />
        </Box>

        <Typography sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 28, color: '#2a1508', mb: 0.5, fontWeight: 400,
        }}>
          Begin your story
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#9a7a60', fontWeight: 300, mb: 3.5 }}>
          Every great reader started with a first page.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FieldLabel>Full name</FieldLabel>
          <TextField fullWidth variant="outlined" size="small"
            value={form.name} onChange={set('name')}
            required autoComplete="name" sx={{ ...fieldSx, mb: 2.5 }} />

          <FieldLabel>Email address</FieldLabel>
          <TextField fullWidth variant="outlined" type="email" size="small"
            value={form.email} onChange={set('email')}
            required autoComplete="email" sx={{ ...fieldSx, mb: 2.5 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FieldLabel>Password</FieldLabel>
              <TextField fullWidth variant="outlined" size="small"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={set('password')}
                required sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(s => !s)} sx={{ color: '#A57650' }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FieldLabel>Confirm password</FieldLabel>
              <TextField fullWidth variant="outlined" size="small"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm} onChange={set('confirm')}
                required sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowConfirm(s => !s)} sx={{ color: '#A57650' }}>
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button type="submit" fullWidth disabled={loading} sx={{
            mt: 3.5, bgcolor: '#851C24', color: '#D5B38E',
            borderRadius: 1.5, py: 1.4,
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic', fontSize: 15,
            textTransform: 'none', letterSpacing: 0.5,
            '&:hover': { bgcolor: '#6e1720' },
            '&.Mui-disabled': { bgcolor: '#c0896e', color: '#f0d8be' },
          }}>
            {loading ? <CircularProgress size={22} sx={{ color: '#D5B38E' }} /> : 'Create account'}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, textAlign: 'center', fontSize: 13, color: '#9a7a60', fontWeight: 300 }}>
          Already have an account?{' '}
          <RouterLink to="/login" style={{
            color: '#851C24', fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic', textDecoration: 'none',
          }}>
            Sign in
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  );
}

function Ornament() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#A57650' }} />
      <Box sx={{ width: 44, height: 2, bgcolor: '#A57650' }} />
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#A57650' }} />
    </Box>
  );
}

function FieldLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: 11, color: '#84896D', letterSpacing: 1.5,
      textTransform: 'uppercase', mb: 0.8, fontWeight: 400,
    }}>
      {children}
    </Typography>
  );
}

function TabItem({ label, active, to }) {
  const base = {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 15, mr: 3.5, pb: 1.5, cursor: 'pointer',
    color: active ? '#2a1508' : '#b09070',
    borderBottom: active ? '2px solid #851C24' : '2px solid transparent',
    mb: '-1.5px', textDecoration: 'none', display: 'inline-block',
    '&:hover': { color: '#2a1508' },
  };
  return to
    ? <Typography component={RouterLink} to={to} sx={base}>{label}</Typography>
    : <Typography sx={base}>{label}</Typography>;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff', borderRadius: 1.5,
    fontSize: 14, color: '#3a2010',
    '& fieldset': { borderColor: '#D5B38E' },
    '&:hover fieldset': { borderColor: '#A57650' },
    '&.Mui-focused fieldset': { borderColor: '#851C24', borderWidth: 1 },
  },
};