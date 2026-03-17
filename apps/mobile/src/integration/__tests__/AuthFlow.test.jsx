import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('AuthFlow Integration', () => {
    it('should login successfully', async () => {
        authService.login.mockResolvedValue({
            user: { id: '1', email: 'test@test.com' },
            token: 'token123'
        });

        const { getByPlaceholderText, getAllByText } = render(
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@test.com');
        fireEvent.changeText(getByPlaceholderText('auth.password'), 'password');
        fireEvent.press(getAllByText('auth.login')[0]);

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalled();
        }, { timeout: 3000 });
    });
});
