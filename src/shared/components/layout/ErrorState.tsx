import { Button } from '@/shared/components/ui/button';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
