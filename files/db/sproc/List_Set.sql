DROP PROCEDURE IF EXISTS [dbo].[List_Set]
GO

CREATE PROCEDURE [dbo].[List_Set]
	@Type [nvarchar](100),
	@Id [nvarchar](100),
	@Label [nvarchar](100),
	@Order [int],
	@SameAs [nvarchar](100) = NULL,
	@Icon [nvarchar](100) = NULL,
	@Description [nvarchar](100) = NULL,
	@Tags [nvarchar](MAX) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF EXISTS(SELECT 1 FROM [dbo].[Lists] WHERE [Id] = @Id AND [Type] = @Type)
	BEGIN
		UPDATE [dbo].[Lists]
		SET
			[Label] = @Label,
			[Order] = @Order,
			[SameAs] = @SameAs,
			[Icon] = @Icon,
			[Description] = @Description,
			[Tags] = @Tags
		WHERE [Id] = @Id AND [Type] = @Type
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Lists] ([Id], [Type], [Label], [Order], [SameAs], [Icon], [Description], [Tags])
		VALUES (@Id, @Type, @Label, @Order, @SameAs, @Icon, @Description, @Tags)
	END
END
