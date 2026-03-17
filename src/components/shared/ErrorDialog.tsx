import {
    Dialog,
    Heading,
    Content,
    ButtonGroup,
    Button,
    Text
} from '@react-spectrum/s2';
import type { ErrorDialogProps } from '../../types';



export const ErrorDialog = ({
    isOpen,
    onClose,
    title = 'Campaign Generation Failed',
    message,
    onRetry
}: ErrorDialogProps) => {
    if (!isOpen || !message) return null;

    return (
        <Dialog size="M">
            <Heading>{title}</Heading>
            <Content>
                <Text>{message}</Text>
            </Content>
            <ButtonGroup>
                <Button variant="secondary" onPress={onClose}>
                    Close
                </Button>
                {onRetry && (
                    <Button variant="accent" onPress={onRetry}>
                        Try Again
                    </Button>
                )}
            </ButtonGroup>
        </Dialog>
    );
};
