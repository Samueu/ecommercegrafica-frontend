'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formatCurrency } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

const STEPS = ['address', 'shipping', 'payment'] as const;
type Step = (typeof STEPS)[number];

const STEP_LABELS: Record<Step, string> = {
  address: 'Endereço',
  shipping: 'Frete',
  payment: 'Pagamento',
};

export function CheckoutWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = (searchParams.get('step') as Step) || 'address';
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const shipping = useMemo(() => (step === 'address' ? 0 : 18.9), [step]);
  const total = subtotal + shipping;

  const stepIndex = STEPS.indexOf(step);

  const goTo = (next: Step) => {
    router.push(`/checkout?step=${next}`);
  };

  const handleFinish = () => {
    clearCart();
    toast.success('Pedido confirmado (mock)!');
    router.push('/pedidos');
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Carrinho vazio. Adicione produtos antes do checkout.</p>
          <Button type="button" className="mt-4" onClick={() => router.push('/produtos')}>
            Ver produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <ol className="flex gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium sm:text-sm',
                i <= stepIndex ? 'border-primary bg-primary/5' : 'text-muted-foreground',
              )}
            >
              {STEP_LABELS[s]}
            </li>
          ))}
        </ol>

        {step === 'address' && (
          <Card>
            <CardHeader>
              <CardTitle>Endereço de entrega</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="zip">CEP</Label>
                <Input id="zip" placeholder="00000-000" defaultValue="01310-100" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" defaultValue="Av. Paulista" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input id="number" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" defaultValue="São Paulo" />
              </div>
              <Button type="button" className="sm:col-span-2" onClick={() => goTo('shipping')}>
                Continuar para frete
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'shipping' && (
          <Card>
            <CardHeader>
              <CardTitle>Opção de frete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o frete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Econômico — 5 a 7 dias (R$ 18,90)</SelectItem>
                  <SelectItem value="express">Expresso — 2 dias (R$ 35,00)</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => goTo('address')}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => goTo('payment')}>
                  Continuar para pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select defaultValue="pix">
                <SelectTrigger>
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="card">Cartão de crédito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => goTo('shipping')}>
                  Voltar
                </Button>
                <Button type="button" onClick={handleFinish}>
                  Confirmar pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="line-clamp-1 pr-2">
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity, item.currency)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2">
            <span>Frete</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
