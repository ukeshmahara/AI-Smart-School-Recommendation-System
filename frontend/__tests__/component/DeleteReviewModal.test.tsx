import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteReviewModal from '@/app/admin/reviews/_components/DeleteReviewModal';

describe('DeleteReviewModal', () => {
    test('renders the confirmation heading and warning text', () => {
        render(<DeleteReviewModal isDeleting={false} onCancel={() => {}} onConfirm={() => {}} />);

        expect(screen.getByText('Delete review?')).toBeInTheDocument();
        expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    test('calls onCancel when the Cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = jest.fn();
        render(<DeleteReviewModal isDeleting={false} onCancel={onCancel} onConfirm={() => {}} />);

        await user.click(screen.getByText('Cancel'));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onConfirm when the Delete button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<DeleteReviewModal isDeleting={false} onCancel={() => {}} onConfirm={onConfirm} />);

        await user.click(screen.getByText('Delete'));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('shows "Deleting..." and disables the button when isDeleting is true', () => {
        render(<DeleteReviewModal isDeleting={true} onCancel={() => {}} onConfirm={() => {}} />);

        const deleteButton = screen.getByText('Deleting...');
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toBeDisabled();
    });

    test('does not call onConfirm when the button is disabled while deleting', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();
        render(<DeleteReviewModal isDeleting={true} onCancel={() => {}} onConfirm={onConfirm} />);

        await user.click(screen.getByText('Deleting...'));

        expect(onConfirm).not.toHaveBeenCalled();
    });
});