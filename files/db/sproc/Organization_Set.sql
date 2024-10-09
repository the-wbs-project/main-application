DROP PROCEDURE IF EXISTS [dbo].[Organization_Set]
GO

CREATE PROCEDURE [dbo].[Organization_Set]
    @Id NVARCHAR(100),
    @Name NVARCHAR(100),
    @AiModels NVARCHAR(MAX)
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[Organization]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Organization]
        SET [Name] = @Name,
            [AiModels] = @AiModels,
            [UpdatedAt] = GETUTCDATE()
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Organization]
            (
            [Id],
            [Name],
            [AiModels],
            [CreatedAt],
            [UpdatedAt]
            )
        VALUES
            (@Id, @Name, @AiModels, GETUTCDATE(), GETUTCDATE())
    END
END
GO