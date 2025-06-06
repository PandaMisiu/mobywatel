import { useState } from 'react';
import {
  Paper,
  TextField,
  Box,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { AppButton, AppTypography } from '../atoms';

export interface SearchFilters {
  citizenID: string;
  PESEL: string;
  searchType: 'citizenID' | 'PESEL' | 'all';
}

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    citizenID: '',
    PESEL: '',
    searchType: 'all',
  });

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      citizenID: '',
      PESEL: '',
      searchType: 'all',
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const isSearchDisabled =
    filters.searchType !== 'all' && !filters.citizenID && !filters.PESEL;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <AppTypography variant='h6' gutterBottom>
        Wyszukaj obywatela
      </AppTypography>

      <Grid container spacing={2} alignItems='center'>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Typ wyszukiwania</InputLabel>
            <Select
              value={filters.searchType}
              label='Typ wyszukiwania'
              onChange={(e) => handleFilterChange('searchType', e.target.value)}
            >
              <MenuItem value='all'>Wszyscy obywatele</MenuItem>
              <MenuItem value='citizenID'>Po ID obywatela</MenuItem>
              <MenuItem value='PESEL'>Po PESEL</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {filters.searchType === 'citizenID' && (
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label='ID Obywatela'
              value={filters.citizenID}
              onChange={(e) => handleFilterChange('citizenID', e.target.value)}
              type='number'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        {filters.searchType === 'PESEL' && (
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label='PESEL'
              value={filters.PESEL}
              onChange={(e) => handleFilterChange('PESEL', e.target.value)}
              inputProps={{ maxLength: 11 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant='contained'
              onClick={handleSearch}
              disabled={loading || isSearchDisabled}
              startIcon={<Search />}
            >
              Wyszukaj
            </AppButton>
            <AppButton
              variant='outlined'
              onClick={handleClear}
              disabled={loading}
              startIcon={<Clear />}
            >
              Wyczyść
            </AppButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
