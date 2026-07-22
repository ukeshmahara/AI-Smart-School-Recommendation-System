import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarRatingInput from '@/app/dashboard/schools/[id]/_components/StarRatingInput';

describe('StarRatingInput', () => {
    test('renders 5 star buttons', () => {
        render(<StarRatingInput value={0} onChange={() => {}} />);

        expect(screen.getByLabelText('1 star')).toBeInTheDocument();
        expect(screen.getByLabelText('2 stars')).toBeInTheDocument();
        expect(screen.getByLabelText('3 stars')).toBeInTheDocument();
        expect(screen.getByLabelText('4 stars')).toBeInTheDocument();
        expect(screen.getByLabelText('5 stars')).toBeInTheDocument();
    });

    test('calls onChange with the correct number when a star is clicked', async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        render(<StarRatingInput value={0} onChange={onChange} />);

        await user.click(screen.getByLabelText('3 stars'));

        expect(onChange).toHaveBeenCalledWith(3);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('shows stars filled up to the current value', () => {
        render(<StarRatingInput value={3} onChange={() => {}} />);

        const star1 = screen.getByLabelText('1 star').querySelector('svg');
        const star3 = screen.getByLabelText('3 stars').querySelector('svg');
        const star4 = screen.getByLabelText('4 stars').querySelector('svg');

        expect(star1).toHaveClass('fill-amber-400');
        expect(star3).toHaveClass('fill-amber-400');
        expect(star4).not.toHaveClass('fill-amber-400');
    });

    test('shows a hover preview of filled stars, independent of the actual value', async () => {
        const user = userEvent.setup();
        render(<StarRatingInput value={1} onChange={() => {}} />);

        const star4Button = screen.getByLabelText('4 stars');
        await user.hover(star4Button);

        const star4 = star4Button.querySelector('svg');
        expect(star4).toHaveClass('fill-amber-400');
    });
});