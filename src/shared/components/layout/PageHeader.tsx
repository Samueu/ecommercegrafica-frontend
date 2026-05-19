type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
