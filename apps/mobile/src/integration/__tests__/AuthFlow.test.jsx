import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { AlertProvider } from '../../context/AlertContext';
import authService from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Dependencies
jest.mock('../../services/auth.service');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
}));

jest.mock('react-i18next', () => ({
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
        jest.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue(null);
    });

    it('should login successfully and update state', async () => {
        const mockUser = { id: '1', email: 'test@example.com', role: 'WORKER' };
        const mockToken = 'fake-token';
        
        authService.login.mockResolvedValue({
            success: true,
            user: mockUser,
            token: mockToken
        });

        const onLoginSuccess = jest.fn();
        const { getByPlaceholderText, getByLabelText } = render(
            <Wrapper>
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </Wrapper>
        );

        // Fill form
        fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'password123');

        // Submit
        await act(async () => {
            fireEvent.press(getByLabelText('auth.login'));
        });

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
            expect(onLoginSuccess).toHaveBeenCalled();
        });
    });

    it('should show error on login failure', async () => {
        authService.login.mockRejectedValue(new Error('Invalid credentials'));

        const { getByPlaceholderText, getByLabelText } = render(
            <Wrapper>
                <LoginForm />
            </Wrapper>
        );

        fireEvent.changeText(getByPlaceholderText('auth.email'), 'wrong@example.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'wrongpass');

        await act(async () => {
            fireEvent.press(getByLabelText('auth.login'));
        });

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalled();
        });
    });
});
