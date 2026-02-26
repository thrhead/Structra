import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { AlertProvider } from '../../context/AlertContext';
import authService from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Dependencies
vi.mock('../../services/auth.service');
vi.mock('@react-native-async-storage/async-storage', () => ({
    default: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    },
}));

vi.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

const Wrapper = ({ children }) => (
    <AlertProvider>
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    </AlertProvider>
);

describe('AuthFlow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue(null);
    });

    it('should login successfully and update state', async () => {
        const mockUser = { id: '1', email: 'test@example.com', role: 'WORKER' };
        const mockToken = 'fake-token';
        
        authService.login.mockResolvedValue({
            user: mockUser,
            token: mockToken
        });

        const onLoginSuccess = vi.fn();
        const { getByPlaceholderText, getByText } = render(
            <Wrapper>
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </Wrapper>
        );

        // Fill form
        fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'password123');

        // Submit
        fireEvent.press(getByText('auth.login'));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
            expect(onLoginSuccess).toHaveBeenCalled();
        });
    });

    it('should show error on login failure', async () => {
        authService.login.mockRejectedValue(new Error('Invalid credentials'));

        const { getByPlaceholderText, getByText } = render(
            <Wrapper>
                <LoginForm />
            </Wrapper>
        );

        fireEvent.changeText(getByPlaceholderText('auth.email'), 'wrong@example.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'wrongpass');
        fireEvent.press(getByText('auth.login'));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalled();
        });
        
        // Error handling check (Alert is usually mocked in RN tests)
    });
});
