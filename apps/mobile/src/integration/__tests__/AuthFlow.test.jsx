import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
}));

describe('AuthFlow Integration', () => {
    it('should login successfully', async () => {
        authService.login.mockResolvedValue({
            success: true,
            user: { id: '1', email: 'test@test.com' },
            token: 'token123'
        });

        const { getByPlaceholderText, getAllByText } = render(
            <AuthProvider>
                <LoginForm onBack={() => {}} />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@test.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'password');

        const loginButtons = getAllByText('auth.login');
        fireEvent.press(loginButtons[loginButtons.length - 1]); // Try the last one if there are multiple

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalled();
        }, { timeout: 3000 });
    });
});
