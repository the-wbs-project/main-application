DROP PROCEDURE IF EXISTS [dbo].[Project_Set]
GO

CREATE PROCEDURE [dbo].[Project_Set]
    @Id nvarchar(100),
    @RecordId nvarchar(100),
    @OwnerId nvarchar(100),
    @CreatedBy nvarchar(100),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Status nvarchar(50),
    @MainNodeView nvarchar(20),
    @Category nvarchar(50),
    @Disciplines nvarchar(MAX),
    @ApprovalStarted bit = NULL,
    @LibraryLink nvarchar(MAX)
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[Projects]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Projects]
        SET [OwnerId] = @OwnerId,
            [CreatedBy] = @CreatedBy,
            [Title] = @Title,
            [Description] = @Description,
            [LastModified] = GETUTCDATE(),
            [Status] = @Status,
            [MainNodeView] = @MainNodeView,
            [Category] = @Category,
            [Disciplines] = @Disciplines,
            [ApprovalStarted] = @ApprovalStarted,
            [LibraryLink] = @LibraryLink
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Projects]
        VALUES
            (@Id, @RecordId, @OwnerId, @CreatedBy, GETUTCDATE(), @Title, @Description, GETUTCDATE(), @Status, @MainNodeView, @Category, @Disciplines, @ApprovalStarted, @LibraryLink)
    END
END
GO