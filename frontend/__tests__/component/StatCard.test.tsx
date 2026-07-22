import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import StatCard from '@/app/admin/analytics/_components/StatCard';

describe('StatCard', () => {
    test('renders the label and value', () => {
        render(<StatCard label="Total Users" value={22} icon={Users} bg="bg-blue-50" color="text-blue-700" />);

        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('22')).toBeInTheDocument();
    });

    test('renders a string value as well as a number value', () => {
        render(<StatCard label="Average Fees" value="Rs 507,790" icon={Users} bg="bg-amber-50" color="text-amber-700" />);

        expect(screen.getByText('Rs 507,790')).toBeInTheDocument();
    });

    test('applies the provided background and icon color classes', () => {
        const { container } = render(
            <StatCard label="Total Schools" value={27} icon={Users} bg="bg-purple-50" color="text-purple-700" />
        );

        expect(container.querySelector('.bg-purple-50')).toBeInTheDocument();
        expect(container.querySelector('.text-purple-700')).toBeInTheDocument();
    });
});