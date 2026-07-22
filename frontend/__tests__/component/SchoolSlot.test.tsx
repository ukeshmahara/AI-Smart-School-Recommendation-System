import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SchoolSlot from '@/app/dashboard/compare/_components/SchoolSlot';

const mockSchool = {
    _id: 'school-1',
    name: 'Imperial World School',
    location: 'Baluwatar, Kathmandu',
    fees: 650000,
    category: 'private',
    streamsOffered: ['science', 'management'],
};

describe('SchoolSlot (filled state)', () => {
    test('renders the school name when a school is provided', () => {
        render(
            <SchoolSlot school={mockSchool} excludeIds={[]} onSelect={() => {}} onRemove={() => {}} />
        );

        expect(screen.getByText('Imperial World School')).toBeInTheDocument();
    });

    test('renders the formatted annual fee', () => {
        render(
            <SchoolSlot school={mockSchool} excludeIds={[]} onSelect={() => {}} onRemove={() => {}} />
        );

        expect(screen.getByText('Rs 650,000')).toBeInTheDocument();
    });

    test('calls onRemove when the remove button is clicked', async () => {
        const user = userEvent.setup();
        const onRemove = jest.fn();
        render(
            <SchoolSlot school={mockSchool} excludeIds={[]} onSelect={() => {}} onRemove={onRemove} />
        );

        await user.click(screen.getByLabelText('Remove school'));

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    test('shows the empty "Add school" state when no school is provided', () => {
        render(
            <SchoolSlot school={null} excludeIds={[]} onSelect={() => {}} onRemove={() => {}} />
        );

        expect(screen.getByText('Add school')).toBeInTheDocument();
    });
});