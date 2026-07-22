import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import CompareCheckbox from '@/app/dashboard/schools/_components/CompareCheckbox';
import { useCompare } from '@/lib/contexts/CompareContext';

jest.mock('react-toastify', () => ({
    toast: {
        info: jest.fn(),
    },
}));

jest.mock('@/lib/contexts/CompareContext', () => ({
    useCompare: jest.fn(),
    MAX_COMPARE: 3,
}));

const mockUseCompare = useCompare as jest.Mock;

describe('CompareCheckbox', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows unselected state by default', () => {
        mockUseCompare.mockReturnValue({
            isSelected: () => false,
            toggleCompare: jest.fn(),
            isMaxReached: false,
        });

        render(<CompareCheckbox schoolId="school-1" />);

        expect(screen.getByText('Add to compare')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('shows selected state when the school is already selected', () => {
        mockUseCompare.mockReturnValue({
            isSelected: () => true,
            toggleCompare: jest.fn(),
            isMaxReached: false,
        });

        render(<CompareCheckbox schoolId="school-1" />);

        expect(screen.getByText('Selected to compare')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('calls toggleCompare when clicked and not at the limit', async () => {
        const user = userEvent.setup();
        const toggleCompare = jest.fn();
        mockUseCompare.mockReturnValue({
            isSelected: () => false,
            toggleCompare,
            isMaxReached: false,
        });

        render(<CompareCheckbox schoolId="school-1" />);
        await user.click(screen.getByText('Add to compare'));

        expect(toggleCompare).toHaveBeenCalledWith('school-1');
    });

    test('shows a warning toast instead of toggling when already at the 3-school limit', async () => {
        const user = userEvent.setup();
        const toggleCompare = jest.fn();
        mockUseCompare.mockReturnValue({
            isSelected: () => false,
            toggleCompare,
            isMaxReached: true,
        });

        render(<CompareCheckbox schoolId="school-1" />);
        await user.click(screen.getByText('Add to compare'));

        expect(toast.info).toHaveBeenCalledWith('You can compare up to 3 schools at a time');
        expect(toggleCompare).not.toHaveBeenCalled();
    });
});