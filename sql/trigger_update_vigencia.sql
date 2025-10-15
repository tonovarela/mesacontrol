

CREATE OR ALTER TRIGGER tr_update_vigencia_on_gaveta_change
ON ordenSobre
AFTER UPDATE
AS
BEGIN
    -- Verificar si el campo no_gaveta fue modificado	
    IF UPDATE(no_gaveta)
    BEGIN
        -- Imprimir los orden_metrics que se están procesando
        DECLARE @orden_metrics NVARCHAR(MAX) = '';
        SELECT @orden_metrics = @orden_metrics + CAST(i.orden_metrics AS NVARCHAR(50)) + ','
        FROM inserted i;
        
        -- Remover la última coma y espacio
        IF LEN(@orden_metrics) > 0
        BEGIN
            SET @orden_metrics = LEFT(@orden_metrics, LEN(@orden_metrics) - 1);
            PRINT 'Actualizando vigencia para orden_metrics: ' + @orden_metrics;
        END
        
        -- Actualizar el campo vigencia para los registros modificados
        UPDATE ordenSobre 
        SET vigencia = GETDATE()
        FROM ordenSobre os
        INNER JOIN inserted i ON os.orden_metrics = i.orden_metrics
        WHERE os.no_gaveta <> (
            SELECT d.no_gaveta 
            FROM deleted d 
            WHERE d.orden_metrics = os.orden_metrics
        )
        OR (os.no_gaveta IS NOT NULL AND (
            SELECT d.no_gaveta 
            FROM deleted d 
            WHERE d.orden_metrics = os.orden_metrics
        ) IS NULL)
        OR (os.no_gaveta IS NULL AND (
            SELECT d.no_gaveta 
            FROM deleted d 
            WHERE d.orden_metrics = os.orden_metrics
        ) IS NOT NULL);
    END
END;

-- Comentarios sobre el trigger:
-- 1. Se ejecuta DESPUÉS de una operación UPDATE
-- 2. Solo se activa cuando el campo no_gaveta es modificado
-- 3. Actualiza vigencia con la fecha y hora actual (GETDATE())
-- 4. Maneja correctamente los casos donde no_gaveta puede ser NULL
-- 5. Compara el valor anterior (deleted) con el nuevo (inserted) para determinar si hubo cambio real
